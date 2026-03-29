# RetailIQ Frontend-Backend Alignment Plan
**Objective:** Achieve 100% frontend-backend alignment with full usability and feature completeness.

## Current Status
- ✅ Purchase order form payload aligned (removed internal_notes, mapped line_items to items with ordered_qty)
- ✅ Core API adapters (purchaseOrders, developer, marketplace) normalized with backend contracts
- ✅ High-impact pages (Marketplace, Suppliers, Developer) verified for correct API usage
- ⚠️ Environment: node_modules not installed (run `npm install` to resolve TypeScript errors)

## Detailed Alignment Tasks

### Phase 1: Critical CRUD Completeness (Priority: HIGH)
1. **Inventory Management**
   - Verify InventoryForm payload matches backend product create/update schema
   - Ensure product activation/deactivation API calls aligned
   - Check category filtering and pagination parameters

2. **Sales & Transactions**
   - Audit POS page transaction creation payload
   - Verify TransactionDetail API response normalization
   - Check ReceiptsTemplate integration with backend

3. **Store Configuration**
   - StoreProfile update payload alignment
   - StoreTaxConfig tax rates/SLAs mapping to backend
   - StoreCategories create/update/delete contracts

### Phase 2: Feature Completeness (Priority: HIGH)
4. **Authentication & Security**
   - Verify MFA setup/verification flows
   - Password reset request/confirm endpoints
   - JWT refresh token handling edge cases

5. **Analytics & Reporting**
   - Dashboard KPI data contracts
   - Analytics page filters and date ranges
   - Forecasting API parameters and response shape

6. **Supply Chain Features**
   - StockAudit API alignment
   - Chain management endpoints
   - GST compliance data structures

### Phase 3: Advanced Features (Priority: MEDIUM)
7. **Communications**
   - WhatsApp integration payload
   - Email templates and sending
   - Notification preferences

8. **Vision & OCR**
   - VisionOcrUpload file handling
   - VisionOcrReview data extraction
   - Image processing API contracts

9. **Finance & Loyalty**
   - Finance dashboard data contracts
   - Loyalty program CRUD operations
   - Pricing rules and promotions

### Phase 4: Quality Assurance (Priority: MEDIUM)
10. **Error Handling**
    - Standardize error message parsing
    - Ensure 401/403 handling across all pages
    - Network retry logic verification

11. **Loading States**
    - Consistent skeleton loaders
    - Optimistic updates where appropriate
    - Mutation loading states

12. **Data Validation**
    - Frontend validation matches backend rules
    - Form validation schemas completeness
    - Type safety enforcement

## Implementation Strategy

### Daily Execution Plan
1. **Morning Audit (2 hours)**
   - Select 2-3 pages from current phase
   - Review API calls and payloads
   - Document mismatches

2. **Fix Session (3 hours)**
   - Implement payload corrections
   - Update type definitions
   - Test API interactions

3. **Verification (1 hour)**
   - Run type checks
   - Verify error handling
   - Update documentation

### Quality Gates
- All API payloads must match backend schemas exactly
- Frontend types must reflect backend response structures
- No stubbed or placeholder features remain
- 80%+ test coverage for critical paths
- Zero TypeScript errors (after npm install)

## Risk Mitigation
- **Backend Changes:** Maintain adapter layer for quick contract updates
- **Complex Payloads:** Use Zod schemas for runtime validation
- **Missing Endpoints:** Implement graceful degradation with clear messaging
- **Performance:** Implement React Query caching strategies

## Success Metrics
- [ ] All CRUD operations functional across all modules
- [ ] Zero console errors in production
- [ ] All forms submit successfully with proper validation
- [ ] Consistent error handling across the application
- [ ] Full feature parity with backend capabilities

## Next Steps
1. Install dependencies: `npm install`
2. Start with Phase 1: Inventory Management alignment
3. Complete each phase before moving to the next
4. Daily progress updates and completion tracking

---
**Timeline Estimate:** 5-7 days for full alignment
**Dependencies:** Backend API stability, access to test environment
**Owner:** Cascade (AI Assistant)
