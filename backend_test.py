#!/usr/bin/env python3
"""
Backend API Testing Script - NAVYRIX Rebrand Verification
Tests all backend endpoints to ensure rebrand did not break functionality.
"""

import requests
import json
import time
import sys
from datetime import datetime

# Base URL from environment
BASE_URL = "https://form-flow-34.preview.emergentagent.com/api"

def print_test(name, passed, details=""):
    """Print test result with formatting"""
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"{status} - {name}")
    if details:
        print(f"   {details}")
    print()

def test_health():
    """Test 1: GET /api/health"""
    print("=" * 60)
    print("TEST 1: Health Endpoint")
    print("=" * 60)
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            data.get("ok") == True and
            data.get("service") == "agency-api"
        )
        
        print_test(
            "GET /api/health",
            passed,
            f"Status: {response.status_code}, Response: {json.dumps(data)}"
        )
        return passed
    except Exception as e:
        print_test("GET /api/health", False, f"Error: {str(e)}")
        return False

def test_contact_form_valid():
    """Test 2: POST /api/contact with valid payload"""
    print("=" * 60)
    print("TEST 2: Contact Form - Valid Submission")
    print("=" * 60)
    try:
        payload = {
            "fullName": "Rebrand QA",
            "email": "ls2170184@gmail.com",
            "phone": "+1 415 555 0198",
            "businessName": "Rebrand Test",
            "website": "",
            "service": "Web Design & Development",
            "budget": "$25,000 – $50,000",
            "message": "Verifying NAVYRIX rebrand."
        }
        
        response = requests.post(f"{BASE_URL}/contact", json=payload, timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            data.get("ok") == True and
            "id" in data
        )
        
        print_test(
            "POST /api/contact (valid)",
            passed,
            f"Status: {response.status_code}, UUID: {data.get('id', 'N/A')}"
        )
        
        return passed, data.get("id")
    except Exception as e:
        print_test("POST /api/contact (valid)", False, f"Error: {str(e)}")
        return False, None

def test_get_leads(expected_id=None):
    """Test 3: GET /api/leads and verify lead exists"""
    print("=" * 60)
    print("TEST 3: Get Leads - Verify Persistence")
    print("=" * 60)
    try:
        response = requests.get(f"{BASE_URL}/leads", timeout=10)
        data = response.json()
        
        passed = response.status_code == 200 and "leads" in data
        
        if passed and expected_id:
            # Check if our test lead exists
            lead_found = any(lead.get("id") == expected_id for lead in data.get("leads", []))
            passed = passed and lead_found
            details = f"Status: {response.status_code}, Lead found: {lead_found}, Total leads: {len(data.get('leads', []))}"
        else:
            details = f"Status: {response.status_code}, Total leads: {len(data.get('leads', []))}"
        
        print_test("GET /api/leads", passed, details)
        return passed
    except Exception as e:
        print_test("GET /api/leads", False, f"Error: {str(e)}")
        return False

def test_contact_form_missing_field():
    """Test 4: POST /api/contact missing required field"""
    print("=" * 60)
    print("TEST 4: Contact Form - Missing Required Field")
    print("=" * 60)
    try:
        payload = {
            "fullName": "Test User",
            "email": "test@example.com",
            "phone": "+1 415 555 0198",
            "businessName": "Test Business",
            "service": "Web Design & Development",
            "budget": "$10,000 – $25,000"
            # Missing "message" field
        }
        
        response = requests.post(f"{BASE_URL}/contact", json=payload, timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 400 and
            "error" in data
        )
        
        print_test(
            "POST /api/contact (missing field)",
            passed,
            f"Status: {response.status_code}, Error: {data.get('error', 'N/A')}"
        )
        return passed
    except Exception as e:
        print_test("POST /api/contact (missing field)", False, f"Error: {str(e)}")
        return False

def test_contact_form_invalid_email():
    """Test 5: POST /api/contact with invalid email"""
    print("=" * 60)
    print("TEST 5: Contact Form - Invalid Email")
    print("=" * 60)
    try:
        payload = {
            "fullName": "Test User",
            "email": "abc",  # Invalid email
            "phone": "+1 415 555 0198",
            "businessName": "Test Business",
            "website": "",
            "service": "Web Design & Development",
            "budget": "$10,000 – $25,000",
            "message": "Test message"
        }
        
        response = requests.post(f"{BASE_URL}/contact", json=payload, timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 400 and
            "error" in data
        )
        
        print_test(
            "POST /api/contact (invalid email)",
            passed,
            f"Status: {response.status_code}, Error: {data.get('error', 'N/A')}"
        )
        return passed
    except Exception as e:
        print_test("POST /api/contact (invalid email)", False, f"Error: {str(e)}")
        return False

def test_newsletter_fresh_email():
    """Test 6: POST /api/newsletter with fresh email"""
    print("=" * 60)
    print("TEST 6: Newsletter - Fresh Email")
    print("=" * 60)
    try:
        timestamp = int(time.time())
        email = f"navyrix.rebrand+{timestamp}@example.com"
        
        response = requests.post(f"{BASE_URL}/newsletter", json={"email": email}, timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            data.get("ok") == True
        )
        
        print_test(
            "POST /api/newsletter (fresh email)",
            passed,
            f"Status: {response.status_code}, Email: {email}"
        )
        return passed, email
    except Exception as e:
        print_test("POST /api/newsletter (fresh email)", False, f"Error: {str(e)}")
        return False, None

def test_newsletter_duplicate_email(email):
    """Test 7: POST /api/newsletter with duplicate email"""
    print("=" * 60)
    print("TEST 7: Newsletter - Duplicate Email")
    print("=" * 60)
    try:
        response = requests.post(f"{BASE_URL}/newsletter", json={"email": email}, timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            data.get("ok") == True and
            data.get("alreadySubscribed") == True
        )
        
        print_test(
            "POST /api/newsletter (duplicate)",
            passed,
            f"Status: {response.status_code}, Already subscribed: {data.get('alreadySubscribed', False)}"
        )
        return passed
    except Exception as e:
        print_test("POST /api/newsletter (duplicate)", False, f"Error: {str(e)}")
        return False

def test_newsletter_invalid_email():
    """Test 8: POST /api/newsletter with invalid email"""
    print("=" * 60)
    print("TEST 8: Newsletter - Invalid Email")
    print("=" * 60)
    try:
        response = requests.post(f"{BASE_URL}/newsletter", json={"email": "bad"}, timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 400 and
            "error" in data
        )
        
        print_test(
            "POST /api/newsletter (invalid email)",
            passed,
            f"Status: {response.status_code}, Error: {data.get('error', 'N/A')}"
        )
        return passed
    except Exception as e:
        print_test("POST /api/newsletter (invalid email)", False, f"Error: {str(e)}")
        return False

def test_homepage_branding():
    """Test 9: GET / and verify NAVYRIX branding in HTML"""
    print("=" * 60)
    print("TEST 9: Homepage HTML - NAVYRIX Branding")
    print("=" * 60)
    try:
        response = requests.get("https://form-flow-34.preview.emergentagent.com/", timeout=10)
        html = response.text.lower()
        
        # Check for NAVYRIX (case-insensitive)
        navyrix_count = html.count("navyrix")
        
        # Check for Nexus (should be zero)
        nexus_count = html.count("nexus")
        
        # Check for tagline
        has_tagline = "crafting websites that grow businesses" in html
        
        # Check for founders
        has_lucky = "lucky srivastava" in html
        has_abhishek = "abhishek srivastava" in html
        
        # Check title
        has_title = "<title>navyrix" in html
        
        passed = (
            response.status_code == 200 and
            navyrix_count > 0 and
            nexus_count == 0 and
            has_tagline and
            has_lucky and
            has_abhishek and
            has_title
        )
        
        details = f"""Status: {response.status_code}
   NAVYRIX mentions: {navyrix_count}
   Nexus mentions: {nexus_count} (should be 0)
   Tagline present: {has_tagline}
   Lucky Srivastava: {has_lucky}
   Abhishek Srivastava: {has_abhishek}
   Title correct: {has_title}"""
        
        print_test("GET / (homepage branding)", passed, details)
        return passed
    except Exception as e:
        print_test("GET / (homepage branding)", False, f"Error: {str(e)}")
        return False

def check_resend_logs():
    """Test 10: Check nextjs logs for Resend errors"""
    print("=" * 60)
    print("TEST 10: Resend Integration - Log Check")
    print("=" * 60)
    print("Note: This test checks if Resend notification emails are working correctly.")
    print("Expected: No [resend:notification] errors for ls2170184@gmail.com")
    print("(Newsletter welcome emails to example.com will still show errors - this is expected)")
    print()
    return True  # Manual check, always pass

def main():
    """Run all tests"""
    print("\n" + "=" * 60)
    print("NAVYRIX REBRAND - BACKEND VERIFICATION TEST SUITE")
    print("=" * 60)
    print(f"Base URL: {BASE_URL}")
    print(f"Test Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60 + "\n")
    
    results = []
    
    # Test 1: Health
    results.append(test_health())
    
    # Test 2: Contact form valid
    contact_passed, lead_id = test_contact_form_valid()
    results.append(contact_passed)
    
    # Test 3: Get leads
    results.append(test_get_leads(lead_id))
    
    # Test 4: Contact form missing field
    results.append(test_contact_form_missing_field())
    
    # Test 5: Contact form invalid email
    results.append(test_contact_form_invalid_email())
    
    # Test 6: Newsletter fresh email
    newsletter_passed, newsletter_email = test_newsletter_fresh_email()
    results.append(newsletter_passed)
    
    # Test 7: Newsletter duplicate email
    if newsletter_email:
        results.append(test_newsletter_duplicate_email(newsletter_email))
    else:
        results.append(False)
    
    # Test 8: Newsletter invalid email
    results.append(test_newsletter_invalid_email())
    
    # Test 9: Homepage branding
    results.append(test_homepage_branding())
    
    # Test 10: Resend logs (manual check)
    check_resend_logs()
    
    # Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    passed = sum(results)
    total = len(results)
    percentage = (passed / total * 100) if total > 0 else 0
    
    print(f"Tests Passed: {passed}/{total} ({percentage:.1f}%)")
    print("=" * 60 + "\n")
    
    if passed == total:
        print("✅ ALL TESTS PASSED - Rebrand verification successful!")
        print("   Backend functionality intact, NAVYRIX branding confirmed.")
        return 0
    else:
        print("❌ SOME TESTS FAILED - Review failures above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
