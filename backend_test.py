#!/usr/bin/env python3
"""
Backend API verification test for agency website after env change.
Tests all critical endpoints to ensure AGENCY_NOTIFICATION_EMAIL change doesn't break functionality.
"""

import requests
import json
import time
from datetime import datetime

# Base URL from environment
BASE_URL = "https://form-flow-34.preview.emergentagent.com/api"

def print_test_result(test_name, passed, details=""):
    """Print formatted test result"""
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"\n{status}: {test_name}")
    if details:
        print(f"   Details: {details}")

def test_health_endpoint():
    """Test 1: GET /api/health"""
    print("\n" + "="*80)
    print("TEST 1: GET /api/health")
    print("="*80)
    
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("ok") == True and data.get("service") == "agency-api":
                print_test_result("Health endpoint", True, "Returns correct response")
                return True, None
            else:
                print_test_result("Health endpoint", False, f"Unexpected response structure: {data}")
                return False, data
        else:
            print_test_result("Health endpoint", False, f"Expected 200, got {response.status_code}")
            return False, None
    except Exception as e:
        print_test_result("Health endpoint", False, f"Exception: {str(e)}")
        return False, None

def test_contact_form_submission():
    """Test 2: POST /api/contact with valid payload"""
    print("\n" + "="*80)
    print("TEST 2: POST /api/contact (valid payload)")
    print("="*80)
    
    payload = {
        "fullName": "Env Change Test",
        "email": "ls2170184@gmail.com",
        "phone": "+1 415 555 0198",
        "businessName": "QA Corp",
        "website": "",
        "service": "Web Design & Development",
        "budget": "$10,000 – $25,000",
        "message": "Verifying that new AGENCY_NOTIFICATION_EMAIL env is in effect."
    }
    
    try:
        print(f"Payload: {json.dumps(payload, indent=2)}")
        response = requests.post(
            f"{BASE_URL}/contact",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=15
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("ok") == True and "id" in data:
                lead_id = data.get("id")
                print_test_result("Contact form submission", True, f"Lead created with ID: {lead_id}")
                return True, lead_id
            else:
                print_test_result("Contact form submission", False, f"Missing ok:true or id in response: {data}")
                return False, None
        else:
            print_test_result("Contact form submission", False, f"Expected 200, got {response.status_code}")
            return False, None
    except Exception as e:
        print_test_result("Contact form submission", False, f"Exception: {str(e)}")
        return False, None

def test_leads_retrieval(expected_lead_id=None):
    """Test 3: GET /api/leads"""
    print("\n" + "="*80)
    print("TEST 3: GET /api/leads (verify persistence)")
    print("="*80)
    
    try:
        response = requests.get(f"{BASE_URL}/leads", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            leads = data.get("leads", [])
            print(f"Total leads in database: {len(leads)}")
            
            if expected_lead_id:
                # Look for the specific lead we just created
                found = False
                for lead in leads:
                    if lead.get("id") == expected_lead_id:
                        found = True
                        print(f"Found lead with ID {expected_lead_id}:")
                        print(f"  - Name: {lead.get('fullName')}")
                        print(f"  - Email: {lead.get('email')}")
                        print(f"  - Business: {lead.get('businessName')}")
                        break
                
                if found:
                    print_test_result("Lead persistence", True, f"Lead {expected_lead_id} found in database")
                    return True
                else:
                    print_test_result("Lead persistence", False, f"Lead {expected_lead_id} NOT found in database")
                    return False
            else:
                print_test_result("Leads retrieval", True, f"Retrieved {len(leads)} leads")
                return True
        else:
            print_test_result("Leads retrieval", False, f"Expected 200, got {response.status_code}")
            return False
    except Exception as e:
        print_test_result("Leads retrieval", False, f"Exception: {str(e)}")
        return False

def test_newsletter_subscription():
    """Test 4: POST /api/newsletter with fresh email"""
    print("\n" + "="*80)
    print("TEST 4: POST /api/newsletter (fresh email)")
    print("="*80)
    
    timestamp = int(time.time())
    email = f"env.change+{timestamp}@example.com"
    payload = {"email": email}
    
    try:
        print(f"Payload: {json.dumps(payload, indent=2)}")
        response = requests.post(
            f"{BASE_URL}/newsletter",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("ok") == True:
                print_test_result("Newsletter subscription (fresh)", True, f"Subscribed {email}")
                return True, email
            else:
                print_test_result("Newsletter subscription (fresh)", False, f"Missing ok:true: {data}")
                return False, None
        else:
            print_test_result("Newsletter subscription (fresh)", False, f"Expected 200, got {response.status_code}")
            return False, None
    except Exception as e:
        print_test_result("Newsletter subscription (fresh)", False, f"Exception: {str(e)}")
        return False, None

def test_newsletter_duplicate(email):
    """Test 5: POST /api/newsletter with duplicate email"""
    print("\n" + "="*80)
    print("TEST 5: POST /api/newsletter (duplicate email)")
    print("="*80)
    
    payload = {"email": email}
    
    try:
        print(f"Payload: {json.dumps(payload, indent=2)}")
        response = requests.post(
            f"{BASE_URL}/newsletter",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("alreadySubscribed") == True:
                print_test_result("Newsletter duplicate handling", True, "Correctly returns alreadySubscribed:true")
                return True
            else:
                print_test_result("Newsletter duplicate handling", False, f"Missing alreadySubscribed:true: {data}")
                return False
        else:
            print_test_result("Newsletter duplicate handling", False, f"Expected 200, got {response.status_code}")
            return False
    except Exception as e:
        print_test_result("Newsletter duplicate handling", False, f"Exception: {str(e)}")
        return False

def test_newsletter_invalid_email():
    """Test 6: POST /api/newsletter with invalid email"""
    print("\n" + "="*80)
    print("TEST 6: POST /api/newsletter (invalid email)")
    print("="*80)
    
    payload = {"email": "bad"}
    
    try:
        print(f"Payload: {json.dumps(payload, indent=2)}")
        response = requests.post(
            f"{BASE_URL}/newsletter",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 400:
            print_test_result("Newsletter invalid email validation", True, "Correctly returns 400 for invalid email")
            return True
        else:
            print_test_result("Newsletter invalid email validation", False, f"Expected 400, got {response.status_code}")
            return False
    except Exception as e:
        print_test_result("Newsletter invalid email validation", False, f"Exception: {str(e)}")
        return False

def main():
    """Run all verification tests"""
    print("\n" + "="*80)
    print("AGENCY WEBSITE ENV CHANGE VERIFICATION")
    print("Verifying AGENCY_NOTIFICATION_EMAIL=ls2170184@gmai.com")
    print("="*80)
    
    results = []
    
    # Test 1: Health check
    health_passed, _ = test_health_endpoint()
    results.append(("Health endpoint", health_passed))
    
    # Test 2: Contact form submission
    contact_passed, lead_id = test_contact_form_submission()
    results.append(("Contact form submission", contact_passed))
    
    # Test 3: Lead persistence
    if lead_id:
        time.sleep(1)  # Brief pause to ensure DB write completes
        leads_passed = test_leads_retrieval(lead_id)
        results.append(("Lead persistence", leads_passed))
    else:
        print("\n⚠️  Skipping lead persistence test (no lead ID from previous test)")
        results.append(("Lead persistence", False))
    
    # Test 4: Newsletter subscription (fresh)
    newsletter_passed, fresh_email = test_newsletter_subscription()
    results.append(("Newsletter subscription", newsletter_passed))
    
    # Test 5: Newsletter duplicate
    if fresh_email:
        time.sleep(0.5)
        duplicate_passed = test_newsletter_duplicate(fresh_email)
        results.append(("Newsletter duplicate handling", duplicate_passed))
    else:
        print("\n⚠️  Skipping duplicate test (no email from previous test)")
        results.append(("Newsletter duplicate handling", False))
    
    # Test 6: Newsletter invalid email
    invalid_passed = test_newsletter_invalid_email()
    results.append(("Newsletter invalid email validation", invalid_passed))
    
    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    
    passed_count = sum(1 for _, passed in results if passed)
    total_count = len(results)
    
    for test_name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    print(f"\nTotal: {passed_count}/{total_count} tests passed")
    
    if passed_count == total_count:
        print("\n🎉 ALL TESTS PASSED - Env change verified successfully!")
        return 0
    else:
        print(f"\n⚠️  {total_count - passed_count} test(s) failed")
        return 1

if __name__ == "__main__":
    exit(main())
