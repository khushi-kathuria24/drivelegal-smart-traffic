# Multi-Authority System & Functional Agents - Implementation Guide

## 🎯 Overview

The DriveLegal Smart Traffic System now includes:
1. **Multi-Authority Login System** - Different authorities with distinct roles and permissions
2. **Functional Intelligent Agents** - L1 (Junction), L2 (Regional), L3 (City Governor) agents
3. **Solapur-Specific Features** - Textile corridor, pilgrim mode, localized management

---

## 👥 Authority Types & Access

### 1. Road Authority (🛣️)
**Purpose**: Manage traffic violations and issue challans

**Key Features**:
- Issue challans with photo evidence
- Track violation status and payments
- Generate revenue reports
- Manage violation database

**Permissions**:
- `fine:issue` - Issue traffic fines
- `challan:create` - Create challans
- `violation:document` - Document violations
- `report:generate` - Generate violation reports

**Default User**: `road@solapur.gov / password123`

**Dashboard Location**: `/authority/road-authority`

---

### 2. Municipal Corporation (🏢)
**Purpose**: Traffic monitoring and real-time optimization

**Key Features**:
- Real-time traffic visualization
- Signal optimization and control
- Zone management
- Traffic analytics and predictions
- Emergency alert management
- Parking amenities coordination

**Permissions**:
- `traffic:update` - Control traffic signals
- `traffic:manual-control` - Manual signal override
- `traffic:monitoring:real-time` - Real-time monitoring
- `traffic:signals:optimize` - Optimize signal timing
- `admin:reports` - Generate admin reports

**Default User**: `municipal@solapur.gov / password123`

**Dashboard Location**: `/authority/municipal-corp`

---

### 3. Traffic Police (👮)
**Purpose**: Emergency response and enforcement

**Key Features**:
- Emergency vehicle dispatch
- Violation enforcement
- Patrol management
- Communication center
- Real-time incident tracking

**Permissions**:
- `emergency:activate` - Activate emergency protocols
- `emergency:coordinate` - Coordinate emergencies
- `traffic:manual-control` - Manual traffic control
- `challan:issue` - Issue challans
- `audit:read` - Access audit logs

**Default User**: `police@solapur.gov / password123`

**Dashboard Location**: `/authority/traffic-police`

---

## 🤖 Intelligent Agents System

### Architecture: 3-Level Hierarchical System

```
┌─────────────────────────────────────────┐
│    L3: City Governor Agent (L3)         │ - City-wide analytics & coordination
├─────────────────────────────────────────┤
│  L2: Regional Coordinators (L2)         │ - Zone-wide optimization
│  ┌─────────┬─────────┬─────────────┐   │
│  │ Logistics│ Crowd   │ Guardian    │   │
│  │ Agent   │ Density │ Agent       │   │
│  └─────────┴─────────┴─────────────┘   │
├─────────────────────────────────────────┤
│  L1: Junction Agents (L1)               │ - Local intersection control
│  ┌──────────────────────────────────┐   │
│  │ Real-time Signal Optimization    │   │
│  │ Congestion Detection             │   │
│  │ Emergency Priority Handling       │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## 🚦 Level 1: Junction Agent (L1)

**Purpose**: Real-time traffic signal control at individual intersections

### Capabilities

1. **Signal Optimization**
   - Webster's adaptive algorithm
   - Dynamic green time distribution
   - Vehicle flow prediction

2. **Congestion Detection**
   - Monitors directional vehicle counts
   - Triggers alerts at 80% capacity
   - Activates emergency protocols

3. **Emergency Vehicle Priority**
   - Detects ambulance, fire truck, police
   - Clears intersection (all-red)
   - Grants 30-second green for emergency direction

4. **Flow Prediction**
   - Moving average analysis
   - Trend calculation
   - Next-cycle prediction

### API Endpoints

```bash
# Create Junction Agent
POST /api/agents/junctions/{junctionId}/agent
{
  "coordinates": { "lat": 17.6690, "lng": 75.9220 }
}

# Get Agent Status
GET /api/agents/junctions/{junctionId}/agent/status

# Emergency Priority
POST /api/agents/junctions/{junctionId}/emergency-priority
{
  "vehicleType": "ambulance",
  "direction": "north",
  "eta": 120
}
```

---

## 🌍 Level 2: Regional Coordinator (L2)

**Purpose**: Zone-wide traffic coordination and specialized services

### Three Main Services

#### 1. **Logistics Agent** (Solapur Textile Corridor)
Manages freight traffic and heavy vehicles

```
Features:
- Optimal route calculation for heavy vehicles
- Peak hour monitoring (8-9 AM, 5-6 PM)
- Textile corridor priority lanes
- Congestion level tracking
```

#### 2. **Crowd Density Agent** (Siddheshwar Yatra Management)
Handles high-traffic events and pilgrimages

```
Features:
- Real-time vehicle counting
- Pilgrimage mode activation
- Crowd alert system
- Alternate route recommendations
```

#### 3. **Guardian Agent** (Encroachment Monitoring)
Manages street violations and parking enforcement

```
Features:
- Active encroachment tracking
- Illegal parking detection
- Street encroachment monitoring
- Response time measurement
```

### API Endpoints

```bash
# Create Regional Coordinator
POST /api/agents/zones/{zoneId}/coordinator
{
  "junctions": ["j1", "j2", "j3", "j4"],
  "zoneCoordinates": { "lat": 17.666, "lng": 75.922 }
}

# Get Zone Metrics
GET /api/agents/zones/{zoneId}/coordinator/metrics

# Coordinate Green Wave
POST /api/agents/zones/{zoneId}/green-wave
{
  "direction": "north",
  "speed": 50
}
```

---

## 🏛️ Level 3: City Governor Agent (L3)

**Purpose**: City-wide traffic management and strategic coordination

### Capabilities

1. **City Analytics**
   - Total congestion percentage
   - Vehicle count by zone
   - High-congestion junction identification
   - Emergency count and types

2. **Predictive Analytics**
   - Peak hour prediction
   - Traffic pattern analysis
   - Demand forecasting
   - Resource allocation optimization

3. **Emergency Coordination**
   - Multi-zone emergency routing
   - Resource dispatching
   - Green wave coordination
   - Response time optimization

4. **Incident Management**
   - Active incident tracking
   - Type-based categorization
   - Zone-wise grouping
   - Automatic recommendations

### API Endpoints

```bash
# Initialize City Governor
POST /api/agents/initialize-city-governor
{
  "cityName": "Solapur"
}

# Get City Status
GET /api/agents/city-governor/status

# Get City Analytics
GET /api/agents/city-governor/analytics

# Generate Comprehensive Report
GET /api/agents/city-governor/report

# Coordinate Emergency
POST /api/agents/city-governor/emergency
{
  "vehicleType": "ambulance",
  "location": { "lat": 17.666, "lng": 75.922 },
  "priority": "critical"
}

# Get Resource Allocation
GET /api/agents/city-governor/resources
```

---

## 🚀 Getting Started

### Step 1: Seed Authority Users

```bash
cd smart-traffic-system/backend
node scripts/seedAuthorityUsers.mjs
```

### Step 2: Multi-Authority Login

Visit: `http://localhost:3000/authority-login`

**Demo Credentials**:
- 🛣️ Road Authority: `road@solapur.gov / password123`
- 🏢 Municipal Corp: `municipal@solapur.gov / password123`
- 👮 Traffic Police: `police@solapur.gov / password123`
- 👤 Citizen: `citizen@example.com / citizen123`

### Step 3: Initialize Agents

```bash
# Initialize City Governor
curl -X POST http://localhost:5000/api/agents/initialize-city-governor \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"cityName": "Solapur"}'

# Create Regional Coordinators
curl -X POST http://localhost:5000/api/agents/zones/zone-1/coordinator \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "junctions": ["j1", "j2", "j3"],
    "zoneCoordinates": {"lat": 17.666, "lng": 75.922}
  }'

# Create Junction Agents
curl -X POST http://localhost:5000/api/agents/junctions/j1/agent \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"coordinates": {"lat": 17.669, "lng": 75.922}}'
```

---

## 📊 Solapur-Specific Features

### 1. **Textile Corridor Management**
- Optimizes routes for heavy freight vehicles
- Peak hour protocols: 8-9 AM (incoming), 5-6 PM (outgoing)
- Textile industry zone priority lanes

### 2. **Siddheshwar Yatra Mode**
- Activates during pilgrimage periods
- Automated crowd density monitoring
- Emergency alternate route suggestions
- Pilgrimage periods:
  - **December 20-31**: Jyotiba festival
  - **June 1-15**: Monsoon festival

### 3. **Localized Services**
- Solapur Municipal Corporation coordination
- State-specific vehicle registration formats
- Local traffic rules enforcement
- Regional emergency services integration

---

## 🔒 Permission Matrix

### Road Authority Permissions
```
✅ traffic:read               - View traffic data
✅ parking:read              - View parking info
✅ fine:issue                - Issue fines
✅ challan:create            - Create challans
✅ violation:document        - Document violations
✅ report:generate           - Generate reports
❌ traffic:update            - Cannot update signals
❌ emergency:activate        - Cannot activate emergency
```

### Municipal Corporation Permissions
```
✅ traffic:read              - View traffic data
✅ traffic:update            - Update signals
✅ traffic:manual-control    - Manual control
✅ traffic:monitoring:real-time
✅ traffic:signals:optimize
✅ parking:manage
✅ admin:reports
❌ fine:issue               - Cannot issue fines
❌ emergency:activate       - Cannot activate emergency
```

### Traffic Police Permissions
```
✅ traffic:read
✅ emergency:activate       - Activate emergency
✅ emergency:coordinate
✅ traffic:manual-control
✅ challan:issue
✅ violation:document
✅ audit:read
❌ parking:manage
❌ report:generate
```

---

## 🎯 Common Workflows

### Workflow 1: Issue Challan (Road Authority)

1. Login as Road Authority: `road@solapur.gov`
2. Navigate to "Issue Challan"
3. Enter vehicle number
4. Select violation type
5. Upload photo evidence
6. Generate challan
7. Track payment status

### Workflow 2: Optimize Traffic (Municipal Corporation)

1. Login as Municipal Corp: `municipal@solapur.gov`
2. View "Live Traffic Map"
3. Identify congested zones
4. Activate "Zone Coordinator"
5. Trigger "Green Wave"
6. Monitor metrics in real-time

### Workflow 3: Handle Emergency (Traffic Police)

1. Login as Traffic Police: `police@solapur.gov`
2. Receive emergency alert
3. Click "Emergency Dispatch"
4. Select vehicle type and route
5. Confirm dispatch
6. System automatically coordinates signals
7. Track emergency vehicle progress

---

## 📈 Monitoring Agents

### View Agent Status
```bash
GET /api/agents/all-agents/status
```

### Response Example
```json
{
  "junctionAgents": 12,
  "regionalCoordinators": 5,
  "cityGovernor": "running",
  "timestamp": "2026-06-12T22:00:00Z"
}
```

### Get City Report
```bash
GET /api/agents/city-governor/report
```

---

## ⚙️ Configuration

### Enable Agents in Environment
```env
# .env file
ENABLE_AGENTS=true
AGENT_UPDATE_INTERVAL=10000
MAX_JUNCTION_AGENTS=50
MAX_REGIONAL_COORDINATORS=10
```

### Agent Parameters
```javascript
// Junction Agent
updateInterval: 5000 ms       // Signal optimization interval
cycleTime: 120 seconds        // Total traffic cycle
congestionThreshold: 0.8      // 80% capacity trigger

// Regional Coordinator
updateInterval: 10000 ms      // Zone coordination interval

// City Governor
updateInterval: 15000 ms      // City-wide update interval
```

---

## 🐛 Troubleshooting

### Agents Not Starting
```bash
# Check logs
tail -f logs/agents.log

# Verify MongoDB connection
curl http://localhost:5000/api/health

# Check permissions
GET /api/agents/all-agents/status
```

### Signal Optimization Not Working
```bash
# Verify junction agent
GET /api/agents/junctions/{id}/agent/status

# Check flow data
GET /api/traffic/flow/{junctionId}

# Restart junction agent
POST /api/agents/junctions/{id}/agent
```

### Emergency Priority Not Activating
```bash
# Check emergency endpoint
POST /api/agents/junctions/{id}/emergency-priority

# Verify emergency alert
GET /api/emergency-vehicles/active

# Check signal status
GET /api/traffic-signals/{id}
```

---

## 📞 Support

**For Issues**:
- Check logs: `backend/logs/agents.log`
- Verify API endpoints: `http://localhost:5000/api/agents/all-agents/status`
- Contact System Admin: `admin@traffic.gov`

**Quick Commands**:
```bash
# Stop all agents
POST /api/agents/stop-all

# Get agent metrics
GET /api/agents/city-governor/analytics

# Check health
GET /api/health
```

---

## 🎉 Key Achievements

✅ **Multi-Authority System** - Different login & dashboards for each authority
✅ **Functional Agents** - All 3 levels (L1, L2, L3) fully operational
✅ **Solapur Integration** - Textile corridor, yatra mode, localized features
✅ **Real-time Coordination** - Live signal optimization & emergency handling
✅ **Predictive Analytics** - Traffic forecasting & resource allocation
✅ **Complete Permission System** - Role-based access control
✅ **No Demos** - All agents working with real algorithms

---

**Last Updated**: 2026-06-12
**System Status**: ✅ Production Ready
