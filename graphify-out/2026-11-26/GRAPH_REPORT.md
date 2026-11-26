# Graph Report - fixer-frontend  (2026-11-26)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1025 nodes · 2453 edges · 56 communities (52 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7f68b11f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- admin-schedule.ts
- ShopNavbar.tsx
- lucide-react
- ApplianceDetail.tsx
- SparePartsPage.tsx
- AdminOrderDetail.tsx
- SparePartsEnquiryForm.tsx
- LoginPageClient.tsx
- BookingForm.tsx
- react
- my-bookings/page.tsx
- package.json
- useAuth
- BookingContext.tsx
- ShopMaintenanceGate.tsx
- compilerOptions
- components.json
- next
- AuthContext.tsx
- Navbar
- components/SearchBar.tsx
- dependencies
- HeroOffersCarousel.tsx
- ShopDock.tsx
- admin/layout.tsx
- ACFilterDrawer.tsx
- app/page.tsx
- app/orders/page.tsx
- ACFilterSidebar.tsx
- ACDetailDesktop.tsx
- ACDetailMobile.tsx
- admin/page.tsx
- cn
- AdminOrdersList.tsx
- offers/page.tsx
- utils.ts
- cart/page.tsx
- checkout/page.tsx
- ACDetailAccordion.tsx
- ACProductOverview.tsx
- OrderDetailsClient.tsx
- ShopSearchDialog.tsx
- ShopPartHelpForm.tsx
- appliance-mappings/page.tsx
- feedback/page.tsx
- ACSpecsTable.tsx
- scripts
- ops/page.tsx
- MobileBottomNav.tsx
- LeadFormModal.tsx
- technicians/[id]/page.tsx
- ComingSoonPage.tsx
- cloudinary.ts
- InstallationAddon.tsx
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `react` - 97 edges
2. `next` - 85 edges
3. `useAuth()` - 81 edges
4. `lucide-react` - 50 edges
5. `ShopNavbar()` - 31 edges
6. `Navbar()` - 28 edges
7. `useBooking()` - 27 edges
8. `API_URL` - 26 edges
9. `Footer()` - 25 edges
10. `StaffSlotModal()` - 20 edges

## Surprising Connections (you probably didn't know these)
- `AdminFeedbackPage()` --calls--> `useAuth()`  [EXTRACTED]
  app/admin/feedback/page.tsx → app/context/AuthContext.tsx
- `AdminOpsPage()` --calls--> `useAuth()`  [EXTRACTED]
  app/admin/ops/page.tsx → app/context/AuthContext.tsx
- `AdminShopSettingsPage()` --calls--> `useAuth()`  [EXTRACTED]
  app/admin/shop-settings/page.tsx → app/context/AuthContext.tsx
- `BookingContextType` --references--> `PendingBookingDraft`  [EXTRACTED]
  app/context/BookingContext.tsx → app/lib/pending-booking.ts
- `ACTechnicalDescriptionProps` --references--> `ACProduct`  [EXTRACTED]
  app/components/appliances/ac-detail/ACTechnicalDescription.tsx → app/components/appliances/types.ts

## Import Cycles
- None detected.

## Communities (56 total, 4 thin omitted)

### Community 0 - "admin-schedule.ts"
Cohesion: 0.06
Nodes (71): AddPartModal(), catalogRupees(), formatRupees(), BookingDetailPage(), STATUSES, ManageVisitsModal(), TechOption, AdminBookingsPage() (+63 more)

### Community 1 - "ShopNavbar.tsx"
Cohesion: 0.07
Nodes (48): SHOP_PATHS, TRUST_POINTS, mergePages(), ShopAllProductsPage(), presentation, ShopApplianceCategories(), mobileTrust, ShopAppliancePromo() (+40 more)

### Community 2 - "lucide-react"
Cohesion: 0.06
Nodes (50): ACDescriptionSections(), ACDescriptionSectionsProps, SectionHeading(), ServiceCard(), ACDetailStickyBarProps, ACMobileImageGalleryProps, ACFeatureList(), ACFeatureListProps (+42 more)

### Community 3 - "ApplianceDetail.tsx"
Cohesion: 0.06
Nodes (52): sanitizeProductHtml(), Accordion(), Appliance, ApplianceDetail(), formatSpecValue(), humanizeKey(), inr(), InstallOption (+44 more)

### Community 4 - "SparePartsPage.tsx"
Cohesion: 0.07
Nodes (44): ApplianceShopPage(), CATEGORIES, CATEGORY_API_TYPE, FilterOptions(), Filters, SortKey, SORTS, Category (+36 more)

### Community 5 - "AdminOrderDetail.tsx"
Cohesion: 0.09
Nodes (42): AdminApplianceOrderDetailPage(), AdminOrderDetail(), AdminSparePartOrderDetailPage(), openJobSheet(), openPartBill(), openRetailInvoice(), amountInWords(), convertWhole() (+34 more)

### Community 6 - "SparePartsEnquiryForm.tsx"
Cohesion: 0.12
Nodes (24): ACTechnicalDescription(), ACTechnicalDescriptionProps, hasTechnicalDescription(), LegacySpecsTables(), SectionHeading(), SpecsTable(), TechnicalSection(), TechnicalSectionProps (+16 more)

### Community 7 - "LoginPageClient.tsx"
Cohesion: 0.16
Nodes (21): GoogleSignInButton(), Props, PendingBookingConfirmDialog(), Props, isValidPhone(), normalizePhone(), BOOKING_FLOW_SOURCE, clearPendingBookingDraft() (+13 more)

### Community 8 - "BookingForm.tsx"
Cohesion: 0.12
Nodes (24): BookingForm(), BookingFormProps, Choice(), fromISO(), getServiceNow(), iconFor(), IconInput(), isSlotAvailable() (+16 more)

### Community 9 - "react"
Cohesion: 0.15
Nodes (17): AppliancesSection(), NAV_LINKS, useBooking(), getServiceImage(), Service, SERVICE_IMAGES, SERVICES, SubCategory (+9 more)

### Community 10 - "my-bookings/page.tsx"
Cohesion: 0.16
Nodes (23): buildCustomerPricingSummary(), CUSTOMER_STATUS_STEPS, CustomerPricingSummary, CustomerStatusTone, CustomerStatusView, formatInr(), formatScheduleLabel(), formatVisitSlot() (+15 more)

### Community 11 - "package.json"
Cohesion: 0.11
Nodes (24): eslintConfig, devDependencies, eslint@^9, eslint-config-next@16.4.3, tailwindcss@^4, @tailwindcss/postcss@^4, @types/js-cookie@^3.0.6, @types/node@^20 (+16 more)

### Community 12 - "useAuth"
Cohesion: 0.13
Nodes (15): Lead, LeadsPage(), AdminPartHelpPage(), HelpRequest, STATUSES, ServiceablePincode, ServiceablePincodesPage(), BulkUploadPage() (+7 more)

### Community 13 - "BookingContext.tsx"
Cohesion: 0.14
Nodes (16): BookingModal(), DESKTOP_POINTS, GoogleAuthProvider(), AuthProvider(), BookingContext, BookingContextType, BookingProvider(), CreatePartInquiryInput (+8 more)

### Community 14 - "ShopMaintenanceGate.tsx"
Cohesion: 0.18
Nodes (9): CartLayout(), CheckoutLayout(), ShopMaintenanceGate(), ShopMaintenanceScreen(), SHOWCASE, getShopStatus(), ShopStatus, OrdersLayout() (+1 more)

### Community 15 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 16 - "components.json"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 17 - "next"
Cohesion: 0.12
Nodes (7): APPLIANCE_CATEGORY_IMAGES, ApplianceCategory, ApplianceCategoryCardProps, SparePartsFilterProps, AC_SERVICE_IMAGE, nextConfig, next

### Community 18 - "AuthContext.tsx"
Cohesion: 0.19
Nodes (9): AdminShopSettingsPage(), ShopSettings, LeadFormProps, LeadFormType, API_URL, AuthContext, AuthContextType, User (+1 more)

### Community 19 - "Navbar"
Cohesion: 0.25
Nodes (11): EXPLORE_LINKS, Footer(), LEGAL_LINKS, Navbar(), InsurancePage(), metadata, PrivacyPage(), metadata (+3 more)

### Community 20 - "components/SearchBar.tsx"
Cohesion: 0.17
Nodes (8): IndiaMartHero(), SearchBar(), SearchBarProps, SearchSuggestion, SuggestionGroups, ApplianceTypeCategory, fetchSuggestions(), SparePart

### Community 21 - "dependencies"
Cohesion: 0.13
Nodes (15): dependencies, js-cookie@^3.0.5, lucide-react@^0.544.0, motion@^14.6.0, next@16.4.3, radix-ui@^1.8.1, react@19.2.4, react-dom@19.2.4 (+7 more)

### Community 22 - "HeroOffersCarousel.tsx"
Cohesion: 0.24
Nodes (8): Hero(), TRUST_ITEMS, CAROUSEL_IMAGES, HeroOffersCarousel(), ApiOffer, getHomeOffers(), getShopOffers(), isSafeOfferHref()

### Community 23 - "ShopDock.tsx"
Cohesion: 0.30
Nodes (11): DockButton(), DockItem, ShopDock(), ShopDockProps, Separator(), Tooltip(), TooltipContent(), TooltipProvider() (+3 more)

### Community 24 - "admin/layout.tsx"
Cohesion: 0.22
Nodes (9): AdminLayout(), NAV_ITEMS, NAV_SECTIONS, NavItem, NavSection, Theme, AdminLoginPage(), FixxerLogo() (+1 more)

### Community 25 - "ACFilterDrawer.tsx"
Cohesion: 0.23
Nodes (12): ACFilterDrawer(), CAPACITY_OPTIONS, ChoiceButton(), DEFAULT_FILTERS, FilterSection(), FilterState, getActiveFilterCount(), getFiltersFromParams() (+4 more)

### Community 26 - "app/page.tsx"
Cohesion: 0.28
Nodes (8): DifferenceSection(), POINTS, FloatingCallButton(), HomeShopSection(), InsuranceBanner(), ServicePickerSection(), SocialProofSection(), Home()

### Community 27 - "app/orders/page.tsx"
Cohesion: 0.23
Nodes (12): applianceProductHref(), date(), Filter, hasInstallation(), money(), Order, OrderItem, OrdersPage() (+4 more)

### Community 28 - "ACFilterSidebar.tsx"
Cohesion: 0.25
Nodes (10): ACFilterSidebar(), CAPACITY_OPTIONS, ChoiceButton(), DEFAULT_FILTERS, FilterSection(), FilterState, getFiltersFromParams(), PriceInput() (+2 more)

### Community 29 - "ACDetailDesktop.tsx"
Cohesion: 0.33
Nodes (9): ACDetailDesktop(), ACDetailDesktopProps, ACProduct, DecisionCard(), formatAcType(), formatSpecificationKey(), SectionHeading(), ServiceCard() (+1 more)

### Community 30 - "ACDetailMobile.tsx"
Cohesion: 0.33
Nodes (9): ACDetailMobile(), ACDetailMobileProps, ACProduct, formatAcType(), formatSpecificationKey(), InfoTile(), Reason(), SectionHeading() (+1 more)

### Community 31 - "admin/page.tsx"
Cohesion: 0.33
Nodes (8): AdminDashboardPage(), BookingSearchResult, DashboardStats, formatDate(), formatStatus(), inr(), RevenueBucket, statusClass()

### Community 32 - "cn"
Cohesion: 0.25
Nodes (6): Badge(), badgeVariants, class-variance-authority@^0.7.1, cn@^0.5.0, class-variance-authority, cn

### Community 33 - "AdminOrdersList.tsx"
Cohesion: 0.39
Nodes (5): AdminApplianceOrdersPage(), AdminOrdersList(), OrderType, STATUSES, AdminSparePartOrdersPage()

### Community 34 - "offers/page.tsx"
Cohesion: 0.36
Nodes (7): AdminOffersPage(), campaignStatus(), dateTimeInput(), EMPTY_FORM, Field(), Offer, OfferForm

### Community 35 - "utils.ts"
Cohesion: 0.32
Nodes (6): AdminSparePartsPage(), formatPrice(), clsx@^2.1.1, tailwind-merge@^3.5.0, clsx, tailwind-merge

### Community 36 - "cart/page.tsx"
Cohesion: 0.29
Nodes (7): Cart, CartItem, CartPage(), Coupon, InstallOption, money(), Quote

### Community 37 - "checkout/page.tsx"
Cohesion: 0.36
Nodes (7): Cart, CheckoutPage(), Contact, Field(), money(), Quote, Row()

### Community 38 - "ACDetailAccordion.tsx"
Cohesion: 0.43
Nodes (7): AccordionItem(), AccordionItemProps, ACDetailAccordion(), ACDetailAccordionProps, formatValue(), humanise(), ServiceRow()

### Community 39 - "ACProductOverview.tsx"
Cohesion: 0.43
Nodes (7): ACProductOverview(), ACProductOverviewProps, Benefit(), formatCurrency(), formatText(), Highlight(), toNumber()

### Community 40 - "OrderDetailsClient.tsx"
Cohesion: 0.39
Nodes (6): date(), money(), Order, OrderDetailsClient(), Tracking, OrderDetailsPage()

### Community 41 - "ShopSearchDialog.tsx"
Cohesion: 0.25
Nodes (6): itemClass, PageItem, PAGES, ShopSearchDialogProps, cmdk@^1.1.1, cmdk

### Community 42 - "ShopPartHelpForm.tsx"
Cohesion: 0.36
Nodes (7): InfoStrip(), ReviewRow(), ShopPartHelpForm(), SparePartOption, Step, STEP_LABELS, StepHeading()

### Community 43 - "appliance-mappings/page.tsx"
Cohesion: 0.38
Nodes (6): AdminApplianceMappingsContent(), AdminApplianceMappingsPage(), ApplianceMapping, BookingRow, MappingCard(), SearchResult

### Community 44 - "feedback/page.tsx"
Cohesion: 0.29
Nodes (6): AdminFeedbackPage(), AdminFeedbackView, AdminUser, FeedbackEntry, FollowUp, STATUSES

### Community 45 - "ACSpecsTable.tsx"
Cohesion: 0.48
Nodes (6): ACSpecsTable(), ACSpecsTableProps, formatValue(), humanise(), normalise(), SpecRow

### Community 46 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, dev, lint, start, test, test:watch

### Community 47 - "ops/page.tsx"
Cohesion: 0.33
Nodes (5): AdminOpsPage(), emptyThresholds, OverdueRow, REASONS, Thresholds

### Community 48 - "MobileBottomNav.tsx"
Cohesion: 0.53
Nodes (5): LINK_TABS, LinkTab(), MobileBottomNav(), MobileBottomNavProps, TabCell()

### Community 49 - "LeadFormModal.tsx"
Cohesion: 0.50
Nodes (4): LeadForm(), LeadFormModal(), LeadFormModalProps, LeadFormType

### Community 50 - "technicians/[id]/page.tsx"
Cohesion: 0.83
Nodes (3): docStatusBadgeClass(), TechnicianDetailPage(), verificationBadgeClass()

### Community 52 - "cloudinary.ts"
Cohesion: 0.83
Nodes (3): optimizeCloudinaryUrl(), optimizeGalleryImages(), pickProductGalleryImages()

## Knowledge Gaps
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `admin-schedule.ts`, `ShopNavbar.tsx`, `lucide-react`, `ApplianceDetail.tsx`, `SparePartsPage.tsx`, `AdminOrderDetail.tsx`, `SparePartsEnquiryForm.tsx`, `LoginPageClient.tsx`, `BookingForm.tsx`, `react`, `my-bookings/page.tsx`, `package.json`, `useAuth`, `BookingContext.tsx`, `ShopMaintenanceGate.tsx`, `AuthContext.tsx`, `Navbar`, `components/SearchBar.tsx`, `dependencies`, `HeroOffersCarousel.tsx`, `ShopDock.tsx`, `admin/layout.tsx`, `ACFilterDrawer.tsx`, `app/page.tsx`, `app/orders/page.tsx`, `ACFilterSidebar.tsx`, `ACDetailDesktop.tsx`, `ACDetailMobile.tsx`, `admin/page.tsx`, `AdminOrdersList.tsx`, `utils.ts`, `cart/page.tsx`, `checkout/page.tsx`, `OrderDetailsClient.tsx`, `ShopSearchDialog.tsx`, `ShopPartHelpForm.tsx`, `appliance-mappings/page.tsx`, `ops/page.tsx`, `MobileBottomNav.tsx`, `technicians/[id]/page.tsx`?**
  _High betweenness centrality (0.272) - this node is a cross-community bridge._
- **Should `admin-schedule.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05966386554621849 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `admin-schedule.ts`, `ShopNavbar.tsx`, `lucide-react`, `ApplianceDetail.tsx`, `SparePartsPage.tsx`, `AdminOrderDetail.tsx`, `SparePartsEnquiryForm.tsx`, `LoginPageClient.tsx`, `BookingForm.tsx`, `my-bookings/page.tsx`, `package.json`, `useAuth`, `BookingContext.tsx`, `ShopMaintenanceGate.tsx`, `next`, `AuthContext.tsx`, `components/SearchBar.tsx`, `dependencies`, `HeroOffersCarousel.tsx`, `ShopDock.tsx`, `admin/layout.tsx`, `ACFilterDrawer.tsx`, `app/page.tsx`, `app/orders/page.tsx`, `ACFilterSidebar.tsx`, `admin/page.tsx`, `cn`, `AdminOrdersList.tsx`, `offers/page.tsx`, `utils.ts`, `cart/page.tsx`, `checkout/page.tsx`, `ACDetailAccordion.tsx`, `OrderDetailsClient.tsx`, `ShopSearchDialog.tsx`, `ShopPartHelpForm.tsx`, `appliance-mappings/page.tsx`, `feedback/page.tsx`, `ops/page.tsx`, `MobileBottomNav.tsx`, `LeadFormModal.tsx`, `technicians/[id]/page.tsx`?**
  _High betweenness centrality (0.264) - this node is a cross-community bridge._
- **Should `ShopNavbar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06774774774774775 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `lucide-react` to `ShopNavbar.tsx`, `ApplianceDetail.tsx`, `SparePartsPage.tsx`, `SparePartsEnquiryForm.tsx`, `package.json`, `next`, `components/SearchBar.tsx`, `dependencies`, `ShopDock.tsx`, `ACFilterDrawer.tsx`, `app/orders/page.tsx`, `ACFilterSidebar.tsx`, `ACDetailDesktop.tsx`, `ACDetailMobile.tsx`, `cart/page.tsx`, `checkout/page.tsx`, `ACDetailAccordion.tsx`, `ACProductOverview.tsx`, `OrderDetailsClient.tsx`, `ShopSearchDialog.tsx`, `ShopPartHelpForm.tsx`, `ACSpecsTable.tsx`?**
  _High betweenness centrality (0.115) - this node is a cross-community bridge._
- **Should `lucide-react` be split into smaller, more focused modules?**
  _Cohesion score 0.05593561368209256 - nodes in this community are weakly interconnected._
- **Should `ApplianceDetail.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06169772256728778 - nodes in this community are weakly interconnected._