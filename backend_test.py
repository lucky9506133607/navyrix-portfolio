#!/usr/bin/env python3
"""
Backend API Testing Script - Content Update Verification
Tests all backend endpoints and HTML content to ensure content update did not break functionality.
"""

import requests
import json
import time
import sys
import re
from datetime import datetime

# Base URL from environment
BASE_URL = "https://form-flow-34.preview.emergentagent.com/api"
FRONTEND_URL = "https://form-flow-34.preview.emergentagent.com"

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

def test_contact_form_inr_budget():
    """Test 2: POST /api/contact with NEW INR budget value"""
    print("=" * 60)
    print("TEST 2: Contact Form - INR Budget Value")
    print("=" * 60)
    try:
        payload = {
            "fullName": "Rahul K",
            "email": "ls2170184@gmail.com",
            "phone": "9506482575",
            "businessName": "Test Biz",
            "website": "",
            "service": "Web Design & Development",
            "budget": "₹20,000 – ₹35,000",
            "message": "Content-update sanity test."
        }
        
        response = requests.post(f"{BASE_URL}/contact", json=payload, timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            data.get("ok") == True and
            "id" in data
        )
        
        print_test(
            "POST /api/contact (INR budget)",
            passed,
            f"Status: {response.status_code}, UUID: {data.get('id', 'N/A')}"
        )
        
        return passed, data.get("id")
    except Exception as e:
        print_test("POST /api/contact (INR budget)", False, f"Error: {str(e)}")
        return False, None

def test_get_leads(expected_id=None):
    """Verify lead persistence via GET /api/leads"""
    print("=" * 60)
    print("TEST 2b: Verify Mongo Persistence")
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

def test_contact_form_special_budget():
    """Test 3: POST /api/contact with special budget value"""
    print("=" * 60)
    print("TEST 3: Contact Form - Special Budget Value")
    print("=" * 60)
    try:
        payload = {
            "fullName": "Rahul K",
            "email": "ls2170184@gmail.com",
            "phone": "9506482575",
            "businessName": "Test Biz",
            "website": "",
            "service": "Web Design & Development",
            "budget": "Not Sure (Let's Discuss)",
            "message": "Content-update sanity test."
        }
        
        response = requests.post(f"{BASE_URL}/contact", json=payload, timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            data.get("ok") == True and
            "id" in data
        )
        
        print_test(
            "POST /api/contact (special budget)",
            passed,
            f"Status: {response.status_code}, UUID: {data.get('id', 'N/A')}"
        )
        
        return passed
    except Exception as e:
        print_test("POST /api/contact (special budget)", False, f"Error: {str(e)}")
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
            "budget": "₹10,000 – ₹20,000"
            # Missing "message" field
        }
        
        response = requests.post(f"{BASE_URL}/contact", json=payload, timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 400 and
            "error" in data
        )
        
        print_test(
            "POST /api/contact (missing message)",
            passed,
            f"Status: {response.status_code}, Error: {data.get('error', 'N/A')}"
        )
        return passed
    except Exception as e:
        print_test("POST /api/contact (missing message)", False, f"Error: {str(e)}")
        return False

def test_contact_form_invalid_email():
    """Test 4b: POST /api/contact with invalid email"""
    print("=" * 60)
    print("TEST 4b: Contact Form - Invalid Email")
    print("=" * 60)
    try:
        payload = {
            "fullName": "Test User",
            "email": "abc",  # Invalid email
            "phone": "+1 415 555 0198",
            "businessName": "Test Business",
            "website": "",
            "service": "Web Design & Development",
            "budget": "₹10,000 – ₹20,000",
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
    """Test 5: POST /api/newsletter with fresh email"""
    print("=" * 60)
    print("TEST 5: Newsletter - Fresh Email")
    print("=" * 60)
    try:
        timestamp = int(time.time())
        email = f"content.update+{timestamp}@example.com"
        
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
    """Test 5b: POST /api/newsletter with duplicate email"""
    print("=" * 60)
    print("TEST 5b: Newsletter - Duplicate Email")
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
    """Test 5c: POST /api/newsletter with invalid email"""
    print("=" * 60)
    print("TEST 5c: Newsletter - Invalid Email")
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

def test_homepage_content():
    """Test 6: GET / and verify all content changes"""
    print("=" * 60)
    print("TEST 6: Homepage HTML - Content Verification")
    print("=" * 60)
    try:
        response = requests.get(FRONTEND_URL, timeout=10)
        html = response.text
        
        if response.status_code != 200:
            print_test("GET / (homepage)", False, f"Status: {response.status_code}")
            return False
        
        # Track all checks
        checks = {}
        
        # PRESENT - Must appear
        present_checks = {
            "Build Websites That": "Build Websites That" in html,
            "Grow Your Business": "Grow Your Business" in html,
            "premium web design and development agency": "premium web design and development agency" in html,
            "gyms, restaurants, healthcare": "gyms, restaurants, healthcare" in html,
            "Elite Fitness": "Elite Fitness" in html,
            "Apex Fitness Lab": "Apex Fitness Lab" in html,
            "https://elit-fitness-beryl.vercel.app/": "https://elit-fitness-beryl.vercel.app/" in html,
            "apex-fitness-lab-1.preview.emergentagent.com": "apex-fitness-lab-1.preview.emergentagent.com" in html,
            "What services do you offer?": "What services do you offer?" in html,
            "How long does it take to build a website?": "How long does it take to build a website?" in html,
            "Will my website work on mobile devices?": "Will my website work on mobile devices?" in html,
            "Do you offer website maintenance and support?": "Do you offer website maintenance and support?" in html,
            "How do I get started?": "How do I get started?" in html,
            "+91 95064 82575": "+91 95064 82575" in html,
            "ls2170184@gmail.com": "ls2170184@gmail.com" in html,
            "Chakganjagiri Mubarakpur": "Chakganjagiri Mubarakpur" in html,
            "226201": "226201" in html,
            "Mon–Sat": "Mon–Sat" in html or "Mon-Sat" in html,
            "10:00 AM – 7:00 PM IST": "10:00 AM – 7:00 PM IST" in html or "10:00 AM - 7:00 PM IST" in html,
            "Lucky Srivastava": "Lucky Srivastava" in html,
            "Founder": "Founder" in html,
            "Abhishek Srivastava": "Abhishek Srivastava" in html,
            "Co-Founder": "Co-Founder" in html,
            "Nav link Contact": 'href="#contact"' in html or '>Contact</a>' in html,
        }
        
        # Check for target="_blank" on portfolio links
        # Look for anchor tags with target="_blank" near Elite Fitness or Apex Fitness Lab
        has_target_blank = html.count('target="_blank"') >= 2
        present_checks["target=\"_blank\" on portfolio links"] = has_target_blank
        
        # ABSENT - Must NOT appear
        absent_checks = {
            "Projects delivered": "Projects delivered" not in html,
            "Years in business": "Years in business" not in html,
            "Awards & features": "Awards & features" not in html,
            "Client retention": "Client retention" not in html,
            "Loved by founders & CMOs": "Loved by founders" not in html and "CMOs" not in html,
            "Daniel Reyes": "Daniel Reyes" not in html,
            "Priya Shah": "Priya Shah" not in html,
            "Marcus Chen": "Marcus Chen" not in html,
            "How much do you charge?": "How much do you charge?" not in html,
            "Where are you based": "Where are you based" not in html,
            'href="#about"': 'href="#about"' not in html,
            "$25,000 – $50,000": "$25,000" not in html and "$50,000" not in html,
        }
        
        # Combine all checks
        all_checks = {**present_checks, **absent_checks}
        
        # Count passes and failures
        passed_checks = sum(1 for v in all_checks.values() if v)
        total_checks = len(all_checks)
        
        # Print detailed results
        print(f"   Content checks: {passed_checks}/{total_checks} passed")
        print()
        
        # Show failures
        failures = [k for k, v in all_checks.items() if not v]
        if failures:
            print("   ❌ FAILED CHECKS:")
            for fail in failures:
                print(f"      - {fail}")
            print()
        
        passed = passed_checks == total_checks
        
        print_test(
            "GET / (homepage content)",
            passed,
            f"Status: {response.status_code}, Content checks: {passed_checks}/{total_checks}"
        )
        
        return passed
    except Exception as e:
        print_test("GET / (homepage content)", False, f"Error: {str(e)}")
        return False

def check_resend_logs():
    """Test 7: Check nextjs logs for Resend errors"""
    print("=" * 60)
    print("TEST 7: Resend Integration - Log Check")
    print("=" * 60)
    print("Note: Manual check required - tail /var/log/supervisor/nextjs.out.log")
    print("Expected: No [resend:notification] errors after POST /api/contact")
    print("(Newsletter welcome emails to example.com will still show errors - this is expected)")
    print()
    return True  # Manual check, always pass

def main():
    """Run all tests"""
    print("\n" + "=" * 60)
    print("CONTENT UPDATE - BACKEND VERIFICATION TEST SUITE")
    print("=" * 60)
    print(f"Base URL: {BASE_URL}")
    print(f"Frontend URL: {FRONTEND_URL}")
    print(f"Test Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60 + "\n")
    
    results = []
    
    # Test 1: Health
    results.append(test_health())
    
    # Test 2: Contact form with INR budget
    contact_passed, lead_id = test_contact_form_inr_budget()
    results.append(contact_passed)
    
    # Test 2b: Verify Mongo persistence
    results.append(test_get_leads(lead_id))
    
    # Test 3: Contact form with special budget
    results.append(test_contact_form_special_budget())
    
    # Test 4: Contact form negative cases
    results.append(test_contact_form_missing_field())
    results.append(test_contact_form_invalid_email())
    
    # Test 5: Newsletter
    newsletter_passed, newsletter_email = test_newsletter_fresh_email()
    results.append(newsletter_passed)
    
    if newsletter_email:
        results.append(test_newsletter_duplicate_email(newsletter_email))
    else:
        results.append(False)
    
    results.append(test_newsletter_invalid_email())
    
    # Test 6: Homepage content
    results.append(test_homepage_content())
    
    # Test 7: Resend logs (manual check)
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
        print("✅ ALL TESTS PASSED - Content update verification successful!")
        print("   Backend functionality intact, all content changes confirmed.")
        return 0
    else:
        print("❌ SOME TESTS FAILED - Review failures above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
