# 📚 Complete API Reference Guide

## Base URL
```
Development: http://localhost:5000
Production: https://api.yourdomain.com
```

## Authentication
All endpoints require JWT token in header:
```bash
Authorization: Bearer {access_token}
```

---

## 🔐 Authentication Endpoints

### Login
```
POST /api/auth/login
Content-Type: application/json

Request:
{
  "email": "road@solapur.gov",
  "password": "password123"
}

Response (200):
{
  "token": "eyJhbGc...",
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "permissions": ["fine:issue", "fine:view", ...],
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Road Authority Officer",
    "email": "road@solapur.gov",
    "role": "road_authority",
    "authority": "road_authority",
    "badgeNumber": "RA-001"
  }
}

Error (401):
{ "message": "Invalid credentials" }
```

### Register Citizen
```
POST /api/auth/register
Content-Type: application/json

Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure_password",
  "phone": "9876543210",
  "vehicleNumber": "MH01AB1234"
}

Response (201):
{
  "token": "eyJhbGc...",
  "user": { ... }
}
```

### Register Authority
```
POST /api/auth/register/authority
Content-Type: application/json

Request:
{
  "name": "Officer Name",
  "email": "officer@solapur.gov",
  "password": "password123",
  "authority": "road_authority",
  "department": "Challan Management",
  "badgeNumber": "RA-002",
  "jurisdictionArea": "solapur_city"
}

Response (201):
{ "token": "...", "user": { ... } }
```

---

## 🛣️ Road Authority Endpoints

### Get Statistics
```
GET /api/authority/road/statistics
Authorization: Bearer {token}

Response (200):
{
  "totalIssued": 245,
  "totalViolations": 389,
  "pending": 42,
  "totalRevenue": 245000
}
```

### Get All Challans
```
GET /api/authority/road/challans?page=1&status=pending
Authorization: Bearer {token}

Query Parameters:
  page: int (default: 1)
  status: string (pending|paid|dispute)
  vehicleNumber: string (optional)

Response (200):
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "vehicleNumber": "MH01AB1234",
      "violationType": "Speeding",
      "fineAmount": 500,
      "location": "Zillah Road",
      "status": "pending",
      "issuedDate": "2026-06-12T10:30:00Z",
      "issuedBy": "507f1f77bcf86cd799439010"
    }
  ],
  "page": 1,
  "total": 245,
  "pages": 25
}
```

### Issue Challan
```
POST /api/authority/road/challan/issue
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "vehicleNumber": "MH01AB1234",
  "violationType": "Speeding",
  "fineAmount": 500,
  "location": "Zillah Road Junction",
  "photoUrl": "https://example.com/photo.jpg",
  "description": "Exceeded 60 km/h speed limit"
}

Response (201):
{
  "message": "Challan issued successfully",
  "challan": {
    "_id": "507f1f77bcf86cd799439012",
    "vehicleNumber": "MH01AB1234",
    "violationType": "Speeding",
    "fineAmount": 500,
    "status": "issued",
    "createdAt": "2026-06-12T10:35:00Z"
  }
}
```

### Get Violations
```
GET /api/authority/road/violations?page=1&status=open
Authorization: Bearer {token}

Response (200):
{
  "data": [ ... ],
  "page": 1,
  "total": 389,
  "pages": 39
}
```

### Get Reports
```
GET /api/authority/road/reports?startDate=2026-06-01&endDate=2026-06-30
Authorization: Bearer {token}

Query Parameters:
  startDate: ISO string (optional)
  endDate: ISO string (optional)

Response (200):
{
  "totalChallans": 120,
  "totalViolations": 150,
  "totalRevenue": 500000,
  "averageFine": 4167,
  "byViolationType": {
    "Speeding": 45,
    "No Helmet": 30,
    "Wrong Parking": 25,
    "No Seatbelt": 50
  }
}
```

---

## 🚦 Municipal Corporation Endpoints

### Get Traffic Metrics
```
GET /api/authority/municipal/traffic-metrics?zoneId=solapur_central
Authorization: Bearer {token}

Response (200):
{
  "avgCongestion": 65,
  "totalSignals": 18,
  "signals": [
    {
      "id": "507f1f77bcf86cd799439011",
      "location": "Zillah Road Junction",
      "congestionLevel": 70,
      "status": "operational",
      "greenTime": 45,
      "redTime": 30
    }
  ]
}
```

### Get Zones
```
GET /api/authority/municipal/zones
Authorization: Bearer {token}

Response (200):
[
  {
    "id": "solapur_central",
    "name": "Central Business District",
    "status": "operational"
  },
  {
    "id": "solapur_textile_corridor",
    "name": "Textile Corridor",
    "status": "operational"
  },
  ...
]
```

### Get Signal Status
```
GET /api/authority/municipal/signals
Authorization: Bearer {token}

Response (200):
[
  {
    "id": "507f1f77bcf86cd799439011",
    "location": "Zillah Road Junction",
    "status": "operational",
    "greenTime": 45,
    "redTime": 30,
    "congestionLevel": 70,
    "zoneId": "solapur_central"
  }
]
```

### Update Signal Timing
```
POST /api/authority/municipal/signals/update
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "signalId": "507f1f77bcf86cd799439011",
  "greenTime": 60,
  "redTime": 25
}

Response (200):
{
  "message": "Signal updated successfully",
  "signal": {
    "id": "507f1f77bcf86cd799439011",
    "greenTime": 60,
    "redTime": 25,
    "lastUpdated": "2026-06-12T11:00:00Z"
  }
}
```

### Get Analytics
```
GET /api/authority/municipal/analytics?metric=peak_hours
Authorization: Bearer {token}

Query Parameters:
  metric: string (peak_hours|congestion|efficiency)

Response (200):
{
  "avgCongestion": 65,
  "signalsOptimized": 15,
  "emergencyAlerts": 2,
  "efficiency": 35,
  "peakHours": [
    { "time": "08:00-09:00", "congestion": 85 },
    { "time": "17:00-18:00", "congestion": 78 }
  ]
}
```

---

## 👮 Traffic Police Endpoints

### Get Incidents
```
GET /api/authority/police/incidents?status=active&page=1
Authorization: Bearer {token}

Query Parameters:
  status: string (active|resolved)
  type: string (accident|emergency|breakdown)
  page: int

Response (200):
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "type": "accident",
      "location": "Railway Station Junction",
      "status": "active",
      "priority": "high",
      "createdAt": "2026-06-12T11:20:00Z"
    }
  ],
  "totalResolved": 156,
  "avgResponseTime": "4.2 min",
  "page": 1,
  "total": 5
}
```

### Get Emergency Vehicles
```
GET /api/authority/police/emergency-vehicles
Authorization: Bearer {token}

Response (200):
[
  {
    "id": "1",
    "type": "ambulance",
    "status": "available",
    "location": "Station 1"
  },
  {
    "id": "2",
    "type": "fire",
    "status": "on-duty",
    "location": "Station 2"
  }
]
```

### Dispatch Emergency
```
POST /api/authority/police/emergency/dispatch
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "type": "ambulance",
  "location": "Railway Station Junction"
}

Response (201):
{
  "message": "Emergency dispatched successfully",
  "incident": {
    "_id": "507f1f77bcf86cd799439012",
    "type": "ambulance",
    "location": "Railway Station Junction",
    "status": "active",
    "priority": "high"
  }
}
```

### Get Patrols
```
GET /api/authority/police/patrols
Authorization: Bearer {token}

Response (200):
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Patrol Unit 1",
    "status": "active",
    "location": "Zillah Road",
    "officer": "Officer Name"
  }
]
```

### Update Patrol Status
```
POST /api/authority/police/patrol/update
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "patrolId": "507f1f77bcf86cd799439011",
  "status": "inactive",
  "location": "Station"
}

Response (200):
{
  "message": "Patrol updated successfully",
  "patrol": { ... }
}
```

---

## 📊 DriveLegal Partner Endpoints (Read-Only)

### Get Fine Summary
```
GET /api/partner/driveLegal/fines?status=pending&period=month
Authorization: Bearer {token}

Query Parameters:
  status: string (all|pending|paid|dispute)
  period: string (today|week|month)

Response (200):
{
  "data": [
    {
      "vehicleNumber": "MH01AB1234",
      "fineAmount": 500,
      "status": "pending",
      "violationType": "Speeding",
      "location": "Zillah Road",
      "createdAt": "2026-06-12T10:30:00Z"
    }
  ],
  "metrics": {
    "total": 245,
    "paid": 156,
    "pending": 67,
    "dispute": 22
  }
}
```

### Get Metrics
```
GET /api/partner/driveLegal/metrics
Authorization: Bearer {token}

Response (200):
{
  "totalFinesInSystem": 5000,
  "revenue": 2500000,
  "collectionRate": 75,
  "topViolations": [
    {
      "_id": "Speeding",
      "count": 1200
    },
    {
      "_id": "No Helmet",
      "count": 950
    }
  ]
}
```

### Get Payment-Ready Fines
```
GET /api/partner/driveLegal/fines/payment-ready
Authorization: Bearer {token}

Response (200):
[
  {
    "vehicleNumber": "MH01AB1234",
    "fineAmount": 500,
    "violationType": "Speeding",
    "issuedDate": "2026-06-10T08:00:00Z"
  }
]
```

---

## 🤖 Agent Control Endpoints

### Initialize City Governor (L3)
```
POST /api/agents/initialize-city-governor
Authorization: Bearer {token}

Response (200):
{
  "message": "City Governor initialized",
  "governor": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "City Governor L3",
    "level": 3,
    "status": "active"
  }
}
```

### Create Junction Agent (L1)
```
POST /api/agents/junctions/{junctionId}/agent
Authorization: Bearer {token}

Response (201):
{
  "message": "Junction Agent created",
  "agent": { ... }
}
```

### Get Junction Agent Status
```
GET /api/agents/junctions/{junctionId}/agent/status
Authorization: Bearer {token}

Response (200):
{
  "status": "active",
  "algorithm": "webster_adaptive",
  "congestion": 65,
  "vehicleCount": 45,
  "lastOptimized": "2026-06-12T11:30:00Z"
}
```

### Get All Agents Status
```
GET /api/agents/all-agents/status
Authorization: Bearer {token}

Response (200):
{
  "l3_governor": {
    "status": "active",
    "metrics": { ... }
  },
  "l2_coordinators": [
    {
      "zoneId": "solapur_central",
      "status": "active"
    }
  ],
  "l1_junctions": [
    {
      "junctionId": "zillah-road",
      "status": "active"
    }
  ]
}
```

---

## 🏘️ Citizen Endpoints

### Get My Challans
```
GET /api/citizen/my-challans
Authorization: Bearer {token}

Response (200):
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "vehicleNumber": "MH01AB1234",
      "violationType": "Speeding",
      "fineAmount": 500,
      "status": "pending",
      "issuedDate": "2026-06-12T10:30:00Z"
    }
  ]
}
```

### Pay Challan
```
POST /api/citizen/challan/pay
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "challanId": "507f1f77bcf86cd799439011",
  "amount": 500
}

Response (200):
{
  "message": "Payment processed",
  "orderId": "order_xyz123",
  "status": "pending"
}
```

### Dispute Challan
```
POST /api/citizen/challan/dispute
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "challanId": "507f1f77bcf86cd799439011",
  "reason": "Speed limit sign was not visible"
}

Response (201):
{
  "message": "Dispute filed",
  "disputeId": "dispute_123"
}
```

---

## 🔄 WebSocket Events

### Subscribe to City Metrics
```javascript
socket.emit('subscribe_city_metrics');

// Listen for updates
socket.on('city_metrics_update', (data) => {
  console.log('City Metrics:', data);
  // {
  //   timestamp: "2026-06-12T11:45:00Z",
  //   data: {
  //     avgCongestion: 65,
  //     activeZones: 5,
  //     emergencyAlerts: 2
  //   }
  // }
});
```

### Subscribe to Zone Metrics
```javascript
socket.emit('subscribe_zone', 'solapur_central');

socket.on('zone_metrics_update', (data) => {
  // {
  //   zoneId: "solapur_central",
  //   data: { congestion: 70, ... }
  // }
});
```

### Subscribe to Junction Metrics
```javascript
socket.emit('subscribe_junction', 'zillah-road-junction');

socket.on('junction_metrics_update', (data) => {
  // { junctionId: "...", data: { ... } }
});
```

### Emergency Alert Listener
```javascript
socket.on('emergency_alert', (alert) => {
  // {
  //   type: "ambulance",
  //   location: "Railway Station",
  //   priority: "critical",
  //   status: "active"
  // }
});
```

---

## ❌ Error Codes & Responses

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Successful request |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Missing/invalid parameters |
| 401 | Unauthorized | Invalid/expired token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate entry |
| 500 | Server Error | Internal server error |

### Example Error Response
```json
{
  "message": "Invalid credentials",
  "code": "AUTH_ERROR",
  "statusCode": 401
}
```

---

**API Version**: 1.0  
**Last Updated**: June 2026  
**Status**: Production Ready
