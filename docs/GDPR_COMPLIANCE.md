# GDPR Compliance Guide

## Overview

This document outlines how the User Service implements GDPR (General Data Protection Regulation) requirements and provides guidance for maintaining compliance.

## Table of Contents

1. [GDPR Principles](#gdpr-principles)
2. [Data Subject Rights](#data-subject-rights)
3. [Implementation](#implementation)
4. [Data Processing Activities](#data-processing-activities)
5. [Security Measures](#security-measures)
6. [Breach Response](#breach-response)
7. [Compliance Checklist](#compliance-checklist)

## GDPR Principles

The User Service is built following GDPR principles:

### 1. Lawfulness, Fairness, and Transparency (Art. 5.1.a)
- **User consent** is explicitly obtained before processing personal data
- **Privacy notices** are clear and accessible
- **Data processing purposes** are clearly communicated
- **Transparency** in how data is collected, used, and shared

### 2. Purpose Limitation (Art. 5.1.b)
- Data is collected for **specified, explicit, and legitimate purposes**
- No further processing in a manner incompatible with those purposes
- Purpose is documented in consent records

### 3. Data Minimization (Art. 5.1.c)
- Only **necessary data** is collected and processed
- Optional fields are clearly marked
- Regular review of data collection requirements

### 4. Accuracy (Art. 5.1.d)
- Users can **update their information** at any time
- Inaccurate data is rectified promptly
- Automated validation for data quality

### 5. Storage Limitation (Art. 5.1.e)
- Data is retained only as long as necessary
- **Retention policies** are implemented:
  - Active users: Indefinite (while account is active)
  - Inactive users: 2 years of inactivity
  - Deleted users: Anonymized immediately
  - Audit logs: 7 years (legal requirement)

### 6. Integrity and Confidentiality (Art. 5.1.f)
- **Encryption at rest** for sensitive data
- **Encryption in transit** (TLS 1.3)
- **Access controls** and authentication
- **Audit logging** for all data access

### 7. Accountability (Art. 5.2)
- **Documented processes** for GDPR compliance
- **Regular audits** and compliance reviews
- **Data Protection Impact Assessments** (DPIA)
- **Records of processing activities**

## Data Subject Rights

The User Service implements all GDPR data subject rights:

### Right to Access (Art. 15)

**Implementation:**
```http
POST /api/v1/gdpr/export-data
Authorization: Bearer {jwt_token}
```

**Features:**
- Export all personal data in machine-readable format (JSON)
- Includes: profile, preferences, consents, activity logs
- Delivered within **30 days** (usually within minutes)
- Secure download link valid for **7 days**

**Process:**
1. User requests data export
2. Background job aggregates all user data
3. Data is packaged in JSON/ZIP format
4. Secure download link sent via email
5. Link expires after 7 days
6. Request logged for audit

### Right to Rectification (Art. 16)

**Implementation:**
```http
PUT /api/v1/users/:id
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "first_name": "Updated Name",
  "last_name": "Updated Last Name",
  "phone": "+1234567890"
}
```

**Features:**
- Users can update their information anytime
- Validated input to ensure accuracy
- Change history maintained in audit logs
- Immediate updates reflected across the system

### Right to Erasure / "Right to Be Forgotten" (Art. 17)

**Implementation:**
```http
POST /api/v1/gdpr/delete-account
Authorization: Bearer {jwt_token}
```

**Features:**
- **30-day grace period** before permanent deletion
- User receives confirmation email with cancellation link
- Can cancel deletion during grace period
- After grace period:
  - Personal data is anonymized
  - Profile marked as deleted
  - Files and avatar removed
  - Audit logs anonymized (PII removed, kept for compliance)

**Data Retention After Deletion:**
- User ID: Retained (anonymized)
- Email: Anonymized (hashed)
- Name: Replaced with "[DELETED]"
- Phone: Removed
- Avatar: Deleted
- Audit logs: PII removed, action retained for compliance

### Right to Restriction of Processing (Art. 18)

**Implementation:**
```http
POST /api/v1/users/:id/restrict-processing
Authorization: Bearer {jwt_token}

{
  "restrict": true,
  "reason": "Accuracy dispute"
}
```

**Features:**
- User can restrict processing while disputing accuracy
- Processing restriction flag in database
- Automated enforcement of restrictions
- Notification sent when restriction is applied/lifted

### Right to Data Portability (Art. 20)

**Implementation:**
- Same as Right to Access
- Data provided in **structured, commonly used format** (JSON/CSV)
- Machine-readable for import to other systems
- Includes all personal data and associated data

### Right to Object (Art. 21)

**Implementation:**
```http
POST /api/v1/gdpr/object-processing
Authorization: Bearer {jwt_token}

{
  "purpose": "marketing",
  "objection": true
}
```

**Features:**
- Object to processing for specific purposes
- Immediately stops processing for that purpose
- Consent management system tracks objections
- Audit trail maintained

### Rights Related to Automated Decision Making (Art. 22)

**Current Status:**
- User Service does not perform automated decision-making or profiling
- If implemented in future, users will have:
  - Right to human intervention
  - Right to contest decision
  - Right to express point of view

## Implementation

### Consent Management

**Consent Types:**
```go
const (
    ConsentMarketing            = "marketing"
    ConsentAnalytics            = "analytics"
    ConsentThirdPartySharing    = "third_party_sharing"
    ConsentPersonalization      = "personalization"
)
```

**Consent Requirements:**
- **Freely given**: User has genuine choice
- **Specific**: Per purpose, not bundled
- **Informed**: Clear information provided
- **Unambiguous**: Clear affirmative action
- **Easy to withdraw**: Same ease as giving consent

**Consent Record:**
```json
{
  "user_id": "507f1f77bcf86cd799439011",
  "purpose": "marketing",
  "granted": true,
  "granted_at": "2024-01-15T10:30:00Z",
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0...",
  "version": "1.0"
}
```

### Data Categories

**Personal Data Collected:**
1. **Identity Data**: Name, email, phone
2. **Contact Data**: Email, phone number
3. **Profile Data**: Avatar, preferences, language, timezone
4. **Technical Data**: IP address, browser type, session info
5. **Usage Data**: Login history, activity logs
6. **Consent Data**: Consent records with timestamp and IP

**Special Categories (Art. 9):**
- User Service does NOT collect special category data:
  - Race or ethnic origin
  - Political opinions
  - Religious beliefs
  - Trade union membership
  - Genetic data
  - Biometric data
  - Health data
  - Sexual orientation

### Data Processing Basis

**Legal Basis for Processing (Art. 6):**
1. **Consent**: Marketing communications
2. **Contract**: Account management and service delivery
3. **Legal Obligation**: Compliance and tax requirements
4. **Legitimate Interest**: Security and fraud prevention

### Privacy by Design

**Technical Measures:**
- **Pseudonymization**: User IDs instead of names in logs
- **Encryption**: At rest (AES-256) and in transit (TLS 1.3)
- **Access Controls**: Role-based access control (RBAC)
- **Multi-tenancy**: Strict tenant data isolation
- **Audit Logging**: All data access logged
- **Data Minimization**: Only necessary fields collected

**Organizational Measures:**
- Privacy impact assessments
- Regular security audits
- Staff training on data protection
- Incident response procedures
- Data protection officer (if required)

## Data Processing Activities

### Records of Processing Activities (Art. 30)

**User Profile Management:**
- **Purpose**: Manage user accounts and profiles
- **Legal Basis**: Contract
- **Data Categories**: Identity, contact, profile
- **Recipients**: Internal systems only
- **Retention**: Active account period + 2 years
- **Security**: Encryption, access control, audit logs

**Marketing Communications:**
- **Purpose**: Send promotional emails and updates
- **Legal Basis**: Consent
- **Data Categories**: Email, name, preferences
- **Recipients**: Email service provider
- **Retention**: Until consent withdrawn
- **Security**: Encryption in transit, access logs

**Security and Fraud Prevention:**
- **Purpose**: Detect and prevent unauthorized access
- **Legal Basis**: Legitimate interest
- **Data Categories**: IP address, login history, device info
- **Recipients**: Internal security team
- **Retention**: 90 days
- **Security**: Encrypted storage, limited access

## Security Measures

### Technical Measures

**Encryption:**
- At rest: AES-256
- In transit: TLS 1.3
- Passwords: bcrypt with cost factor 12 or argon2id

**Access Control:**
- Multi-factor authentication
- Role-based access control (RBAC)
- Principle of least privilege
- Session management with timeout

**Network Security:**
- Firewall protection
- DDoS protection
- Intrusion detection
- Regular security scanning

**Application Security:**
- Input validation and sanitization
- SQL injection prevention (parameterized queries)
- XSS protection
- CSRF protection
- Security headers

### Organizational Measures

**Policies and Procedures:**
- Data protection policy
- Access control policy
- Incident response plan
- Backup and recovery procedures

**Staff Training:**
- Annual GDPR training
- Security awareness training
- Phishing awareness
- Data handling procedures

**Auditing:**
- Regular security audits
- Penetration testing
- Code reviews
- Compliance assessments

## Breach Response

### Data Breach Notification (Art. 33-34)

**Detection:**
- Automated monitoring and alerting
- Audit log analysis
- User reports

**Assessment (within 24 hours):**
1. Confirm breach occurrence
2. Assess scope and impact
3. Identify affected data subjects
4. Determine risk level

**Notification Timeline:**
- **Supervisory Authority**: Within 72 hours of discovery (Art. 33)
- **Data Subjects**: Without undue delay if high risk (Art. 34)

**Notification Content:**
1. Nature of breach
2. Contact point for information
3. Likely consequences
4. Measures taken or proposed
5. Mitigation steps for data subjects

**Breach Response Steps:**
1. **Contain**: Isolate affected systems
2. **Assess**: Determine scope and impact
3. **Notify**: Inform authorities and affected users
4. **Remediate**: Fix vulnerabilities
5. **Review**: Post-incident analysis
6. **Update**: Improve security measures

## Compliance Checklist

### Initial Setup
- [ ] Appoint Data Protection Officer (if required)
- [ ] Document data processing activities
- [ ] Implement consent management system
- [ ] Create privacy policy
- [ ] Implement data subject rights endpoints
- [ ] Set up audit logging
- [ ] Configure data retention policies
- [ ] Establish breach notification procedures

### Ongoing Compliance
- [ ] Regular privacy impact assessments
- [ ] Annual GDPR training for staff
- [ ] Quarterly security audits
- [ ] Review and update privacy policy
- [ ] Monitor and respond to data subject requests
- [ ] Maintain records of processing activities
- [ ] Review and update data retention policies
- [ ] Test incident response procedures

### Data Subject Requests
- [ ] Respond within 30 days (extendable to 60 days)
- [ ] Verify identity before processing
- [ ] Log all requests in audit trail
- [ ] No fee for first request (reasonable fee for additional)
- [ ] Provide data in portable format
- [ ] Confirm completion to data subject

### Third-Party Compliance
- [ ] Data Processing Agreements (DPA) with all processors
- [ ] Verify processors' GDPR compliance
- [ ] Regular audits of processors
- [ ] Document data transfers outside EU (if applicable)
- [ ] Standard Contractual Clauses (SCC) for non-EU transfers

## Resources

### Internal Documentation
- [Privacy Policy](../PRIVACY_POLICY.md)
- [Data Processing Agreement Template](../DPA_TEMPLATE.md)
- [Incident Response Plan](../INCIDENT_RESPONSE.md)

### External Resources
- [GDPR Official Text](https://eur-lex.europa.eu/eli/reg/2016/679/oj)
- [ICO GDPR Guide](https://ico.org.uk/for-organisations/guide-to-data-protection/guide-to-the-general-data-protection-regulation-gdpr/)
- [EDPB Guidelines](https://edpb.europa.eu/our-work-tools/general-guidance/gdpr-guidelines-recommendations-best-practices_en)

## Contact

For GDPR-related questions or to exercise data subject rights:
- Email: privacy@vhvplatform.com
- Data Protection Officer: dpo@vhvplatform.com

---

**Last Updated**: December 2024  
**Version**: 1.0  
**Review Cycle**: Quarterly
