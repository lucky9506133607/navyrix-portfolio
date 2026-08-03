#!/usr/bin/env python3
"""
Backend API Test Suite - Typo Fix Verification
Tests the AGENCY_NOTIFICATION_EMAIL typo fix from ls2170184@gmai.com to ls2170184@gmail.com
"""

import requests
import json
import time
from datetime import datetime

# Base URL from .env
BASE_URL = "https://form-flow-34.preview.emergentagent.com/api"

def print_test_header(test_name):
    print(f"\n{'='*80}")
    print(f"TEST: {test_name}")
    print(f"{'='*80}")

def print_result(success, message):
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status}: {message}")

# Test 1: Verify GET /api/health
def test_health():
    print_test_header("GET /api/health")
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("ok") == True and data.get("service") == "agency-api":
                print_result(True, "Health endpoint returns correct response")
                return True
            else:
                print_result(False, f"Unexpected response structure: {data}")
                return False
        else:
            print_result(False, f"Expected 200, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception: {str(e)}")
        return False

# Test 2: POST /api/contact with valid payload
def test_contact_form():
    print_test_header("POST /api/contact - Valid Payload")
    
    payload = {
        "fullName": "Typo Fix QA",
        "email": "ls2170184@gmail.com",
        "phone": "+1 415 555 0198",
        "businessName": "Nexus QA",
        "website": "",
        "service": "Web Design & Development",
        "budget": "$10,000 – $25,000",
        "message": "Verifying the notification email typo fix."
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
                print_result(True, f"Contact form submitted successfully. Lead ID: {lead_id}")
                return True, lead_id
            else:
                print_result(False, f"Unexpected response structure: {data}")
                return False, None
        else:
            print_result(False, f"Expected 200, got {response.status_code}")
            return False, None
    except Exception as e:
        print_result(False, f"Exception: {str(e)}")
        return False, None

# Test 3: GET /api/leads to verify lead was created
def test_get_leads(expected_lead_id=None):
    print_test_header("GET /api/leads - Verify Lead Persistence")
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
                    print_result(True, f"Lead {expected_lead_id} successfully persisted to MongoDB")
                    return True
                else:
                    print_result(False, f"Lead {expected_lead_id} not found in database")
                    return False
            else:
                print_result(True, f"Retrieved {len(leads)} leads from database")
                return True
        else:
            print_result(False, f"Expected 200, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception: {str(e)}")
        return False

# Test 4: POST /api/newsletter with valid email
def test_newsletter_valid():
    print_test_header("POST /api/newsletter - Valid Email")
    
    # Use timestamp to ensure unique email
    timestamp = int(time.time())
    payload = {
        "email": f"newsletter.typo+{timestamp}@example.com"
    }
    
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
                print_result(True, "Newsletter subscription successful")
                return True
            else:
                print_result(False, f"Unexpected response: {data}")
                return False
        else:
            print_result(False, f"Expected 200, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception: {str(e)}")
        return False

# Test 5: POST /api/newsletter with invalid email
def test_newsletter_invalid():
    print_test_header("POST /api/newsletter - Invalid Email")
    
    payload = {
        "email": "invalid"
    }
    
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
            data = response.json()
            if "error" in data:
                print_result(True, f"Invalid email correctly rejected with error: {data.get('error')}")
                return True
            else:
                print_result(False, "Expected error message in response")
                return False
        else:
            print_result(False, f"Expected 400, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception: {str(e)}")
        return False

# Main test execution
def main():
    print("\n" + "="*80)
    print("TYPO FIX VERIFICATION TEST SUITE")
    print("Verifying AGENCY_NOTIFICATION_EMAIL: ls2170184@gmai.com → ls2170184@gmail.com")
    print("="*80)
    
    results = []
    lead_id = None
    
    # Test 1: Health check
    results.append(("Health Check", test_health()))
    time.sleep(1)
    
    # Test 2: Contact form submission
    success, lead_id = test_contact_form()
    results.append(("Contact Form Submission", success))
    time.sleep(2)  # Give time for async operations
    
    # Test 3: Verify lead persistence
    if lead_id:
        results.append(("Lead Persistence", test_get_leads(lead_id)))
    else:
        results.append(("Lead Persistence", test_get_leads()))
    time.sleep(1)
    
    # Test 4: Newsletter valid email
    results.append(("Newsletter Valid Email", test_newsletter_valid()))
    time.sleep(1)
    
    # Test 5: Newsletter invalid email
    results.append(("Newsletter Invalid Email", test_newsletter_invalid()))
    
    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    print(f"\nTotal: {passed}/{total} tests passed ({(passed/total)*100:.1f}%)")
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED! Typo fix verified successfully.")
        return 0
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Please review the output above.")
        return 1

if __name__ == "__main__":
    exit(main())
