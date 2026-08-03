#!/usr/bin/env python3
"""
Backend API Testing Script for Agency Website
Tests all API endpoints: /api/health, /api/contact, /api/newsletter, /api/leads
"""

import requests
import json
import time
from datetime import datetime

# Base URL from environment
BASE_URL = "https://form-flow-34.preview.emergentagent.com/api"

def print_test_header(test_name):
    print(f"\n{'='*80}")
    print(f"TEST: {test_name}")
    print(f"{'='*80}")

def print_result(passed, message):
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"{status}: {message}")

def print_response(response):
    print(f"Status Code: {response.status_code}")
    try:
        print(f"Response Body: {json.dumps(response.json(), indent=2)}")
    except Exception:
        print(f"Response Body: {response.text}")

# Test 1: Health Check
def test_health():
    print_test_header("GET /api/health")
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=10)
        print_response(response)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("ok") == True and data.get("service") == "agency-api":
                print_result(True, "Health check passed with correct response")
                return True
            else:
                print_result(False, f"Health check returned unexpected data: {data}")
                return False
        else:
            print_result(False, f"Health check failed with status {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Health check exception: {str(e)}")
        return False

# Test 2: Contact Form - Happy Path
def test_contact_happy_path():
    print_test_header("POST /api/contact - Happy Path")
    timestamp = int(time.time())
    payload = {
        "fullName": "John Smith",
        "email": f"test.lead.{timestamp}@example.com",
        "phone": "+1-555-0123",
        "businessName": "Acme Corp",
        "website": "https://acme.example.com",
        "service": "Web Design & Development",
        "budget": "$10,000 – $25,000",
        "message": "We need a complete website redesign with modern UI/UX."
    }
    
    try:
        response = requests.post(f"{BASE_URL}/contact", json=payload, timeout=10)
        print_response(response)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("ok") == True and "id" in data:
                print_result(True, f"Contact form submission successful with ID: {data['id']}")
                return True, payload["email"], data["id"]
            else:
                print_result(False, f"Contact form returned unexpected data: {data}")
                return False, None, None
        else:
            print_result(False, f"Contact form failed with status {response.status_code}")
            return False, None, None
    except Exception as e:
        print_result(False, f"Contact form exception: {str(e)}")
        return False, None, None

# Test 3: Contact Form - Missing Required Field
def test_contact_missing_field():
    print_test_header("POST /api/contact - Missing Required Field (message)")
    payload = {
        "fullName": "Jane Doe",
        "email": "jane.doe@example.com",
        "phone": "+1-555-0124",
        "businessName": "Test Business",
        "service": "Web Design & Development",
        "budget": "$5,000 – $10,000"
        # Missing 'message' field
    }
    
    try:
        response = requests.post(f"{BASE_URL}/contact", json=payload, timeout=10)
        print_response(response)
        
        if response.status_code == 400:
            data = response.json()
            if "error" in data:
                print_result(True, f"Correctly rejected missing field with error: {data['error']}")
                return True
            else:
                print_result(False, "400 status but no error message in response")
                return False
        else:
            print_result(False, f"Expected 400 but got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Contact form missing field test exception: {str(e)}")
        return False

# Test 4: Contact Form - Invalid Email
def test_contact_invalid_email():
    print_test_header("POST /api/contact - Invalid Email Format")
    payload = {
        "fullName": "Invalid Email User",
        "email": "not-an-email",
        "phone": "+1-555-0125",
        "businessName": "Test Business",
        "service": "Web Design & Development",
        "budget": "$5,000 – $10,000",
        "message": "This should fail due to invalid email"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/contact", json=payload, timeout=10)
        print_response(response)
        
        if response.status_code == 400:
            data = response.json()
            if "error" in data:
                print_result(True, f"Correctly rejected invalid email with error: {data['error']}")
                return True
            else:
                print_result(False, "400 status but no error message in response")
                return False
        else:
            print_result(False, f"Expected 400 but got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Contact form invalid email test exception: {str(e)}")
        return False

# Test 5: GET /api/leads - Verify Contact Data
def test_get_leads(expected_email, expected_id):
    print_test_header("GET /api/leads - Verify Contact Data Stored")
    try:
        response = requests.get(f"{BASE_URL}/leads", timeout=10)
        print_response(response)
        
        if response.status_code == 200:
            data = response.json()
            leads = data.get("leads", [])
            
            # Find the lead we just created
            found = False
            for lead in leads:
                if lead.get("email") == expected_email or lead.get("id") == expected_id:
                    found = True
                    print_result(True, f"Found lead in database: {lead.get('fullName')} ({lead.get('email')})")
                    break
            
            if not found:
                print_result(False, f"Lead with email {expected_email} or id {expected_id} not found in database")
                return False
            return True
        else:
            print_result(False, f"GET /api/leads failed with status {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"GET /api/leads exception: {str(e)}")
        return False

# Test 6: Newsletter - Happy Path
def test_newsletter_happy_path():
    print_test_header("POST /api/newsletter - Happy Path")
    timestamp = int(time.time())
    email = f"newsletter.test.{timestamp}@example.com"
    payload = {"email": email}
    
    try:
        response = requests.post(f"{BASE_URL}/newsletter", json=payload, timeout=10)
        print_response(response)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("ok") == True:
                print_result(True, f"Newsletter subscription successful for {email}")
                return True, email
            else:
                print_result(False, f"Newsletter returned unexpected data: {data}")
                return False, None
        else:
            print_result(False, f"Newsletter subscription failed with status {response.status_code}")
            return False, None
    except Exception as e:
        print_result(False, f"Newsletter subscription exception: {str(e)}")
        return False, None

# Test 7: Newsletter - Duplicate Email
def test_newsletter_duplicate(email):
    print_test_header("POST /api/newsletter - Duplicate Email")
    payload = {"email": email}
    
    try:
        response = requests.post(f"{BASE_URL}/newsletter", json=payload, timeout=10)
        print_response(response)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("ok") == True and data.get("alreadySubscribed") == True:
                print_result(True, f"Correctly handled duplicate email with alreadySubscribed flag")
                return True
            else:
                print_result(False, f"Duplicate email not handled correctly: {data}")
                return False
        else:
            print_result(False, f"Expected 200 but got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Newsletter duplicate test exception: {str(e)}")
        return False

# Test 8: Newsletter - Invalid Email
def test_newsletter_invalid_email():
    print_test_header("POST /api/newsletter - Invalid Email")
    payload = {"email": "bad"}
    
    try:
        response = requests.post(f"{BASE_URL}/newsletter", json=payload, timeout=10)
        print_response(response)
        
        if response.status_code == 400:
            data = response.json()
            if "error" in data:
                print_result(True, f"Correctly rejected invalid email with error: {data['error']}")
                return True
            else:
                print_result(False, "400 status but no error message in response")
                return False
        else:
            print_result(False, f"Expected 400 but got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Newsletter invalid email test exception: {str(e)}")
        return False

# Test 9: GET /api/newsletter - Verify Newsletter Data
def test_get_newsletter(expected_email):
    print_test_header("GET /api/newsletter - Verify Newsletter Data Stored")
    try:
        response = requests.get(f"{BASE_URL}/newsletter", timeout=10)
        print_response(response)
        
        if response.status_code == 200:
            data = response.json()
            subscribers = data.get("subscribers", [])
            
            # Find the subscriber we just created
            found = False
            for sub in subscribers:
                if sub.get("email") == expected_email:
                    found = True
                    print_result(True, f"Found subscriber in database: {sub.get('email')}")
                    break
            
            if not found:
                print_result(False, f"Subscriber with email {expected_email} not found in database")
                return False
            return True
        else:
            print_result(False, f"GET /api/newsletter failed with status {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"GET /api/newsletter exception: {str(e)}")
        return False

# Main test execution
def main():
    print("\n" + "="*80)
    print("AGENCY WEBSITE BACKEND API TEST SUITE")
    print(f"Base URL: {BASE_URL}")
    print(f"Test Started: {datetime.now().isoformat()}")
    print("="*80)
    
    results = {}
    
    # Test 1: Health Check
    results["health"] = test_health()
    
    # Test 2-5: Contact Form Tests
    contact_success, contact_email, contact_id = test_contact_happy_path()
    results["contact_happy_path"] = contact_success
    
    results["contact_missing_field"] = test_contact_missing_field()
    results["contact_invalid_email"] = test_contact_invalid_email()
    
    if contact_success and contact_email and contact_id:
        time.sleep(1)  # Give DB a moment to sync
        results["get_leads"] = test_get_leads(contact_email, contact_id)
    else:
        print_result(False, "Skipping GET /api/leads test due to contact form failure")
        results["get_leads"] = False
    
    # Test 6-9: Newsletter Tests
    newsletter_success, newsletter_email = test_newsletter_happy_path()
    results["newsletter_happy_path"] = newsletter_success
    
    if newsletter_success and newsletter_email:
        results["newsletter_duplicate"] = test_newsletter_duplicate(newsletter_email)
    else:
        print_result(False, "Skipping duplicate newsletter test due to initial failure")
        results["newsletter_duplicate"] = False
    
    results["newsletter_invalid_email"] = test_newsletter_invalid_email()
    
    if newsletter_success and newsletter_email:
        time.sleep(1)  # Give DB a moment to sync
        results["get_newsletter"] = test_get_newsletter(newsletter_email)
    else:
        print_result(False, "Skipping GET /api/newsletter test due to newsletter failure")
        results["get_newsletter"] = False
    
    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    print(f"Total Tests: {total}")
    print(f"Passed: {passed}")
    print(f"Failed: {total - passed}")
    print(f"Success Rate: {(passed/total)*100:.1f}%")
    print("\nDetailed Results:")
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {status} - {test_name}")
    print("="*80)
    
    return all(results.values())

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
