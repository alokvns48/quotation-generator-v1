---

## MOBILE RESPONSIVENESS

The entire app must be fully responsive. Follow a mobile-first approach using Tailwind's 
responsive prefixes (sm:, md:, lg:). Target breakpoints:
- Mobile: < 640px (default)
- Tablet: 640px–1024px (sm: / md:)
- Desktop: > 1024px (lg:)

### Sidebar / Navigation
- On mobile: sidebar is HIDDEN by default, slides in from the left as a drawer overlay
- A hamburger menu button (☰) appears in the top bar on mobile
- Clicking outside the drawer or pressing × closes it
- On desktop (lg:): sidebar is always visible, fixed on the left, 240px wide
- Main content has lg:ml-[240px] to offset the sidebar

### Dashboard
- Stat cards: 1 column on mobile, 2 on sm:, 4 on lg:
- Recent quotations table: on mobile, collapse into card list view instead of table
  - Each card shows: Quote No, Customer name, Amount, Status badge, action icons

### QuotationForm
- Layout: single column on mobile, two-column (form | summary panel) on lg:
- Summary panel: on mobile it appears BELOW the form (not sticky sidebar)
- On lg: summary panel is sticky on the right side while scrolling
- Items table on mobile: each item is a card with stacked fields (not a horizontal table row)
  - Show: Particulars (full width text input), then a row with Qty + Rate + Amount
  - Delete button as a red × in the top-right corner of each card
- On lg: items render as a full horizontal table with columns

### QuotationList
- On mobile: render as cards instead of a table
  - Card shows: Quote No + Date (top row), Customer name, Grand Total (bold), Status badge
  - Action buttons: icons only (eye, pencil, trash) in a row at the bottom of the card
- On lg: render as a full table
- Filters: on mobile, stack filters vertically in a collapsible "Filters" accordion

### QuotationPreview
- On mobile: render the preview as a scrollable full-width card
- Print layout always renders as A4 width (794px) regardless of device
  - Wrap the preview in a div that on mobile is scrollable horizontally if needed
- Action buttons (Print, Download PDF, Edit) float as a sticky bottom bar on mobile
- On lg: buttons appear at the top right of the page

### Settings
- Tabs (Firm Profile / Users) become a top tab bar on mobile (full width, scrollable)
- Form fields: full width on mobile, max-w-md on lg:
- Users table: card list on mobile

### Forms & Inputs
- All inputs: h-11 minimum height for touch targets (44px)
- Spacing: use p-4 on mobile, p-6 on lg: for page padding
- Buttons: full-width (w-full) on mobile, auto width on sm:

---

## PDF DOWNLOAD

Use the browser's built-in print-to-PDF via a dedicated print stylesheet.
Do NOT use jsPDF or html2canvas — they produce poor quality. 
Instead, use a two-step approach:

### Step 1: Print Stylesheet
Add a global print.css (or Tailwind @media print block):

  @media print {
    /* Hide everything except the quotation preview */
    body * { visibility: hidden; }
    #quotation-print-area, #quotation-print-area * { visibility: visible; }
    #quotation-print-area {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
    }
    
    /* A4 page setup */
    @page {
      size: A4;
      margin: 15mm;
    }
    
    /* Hide action buttons */
    .no-print { display: none !important; }
    
    /* Ensure table borders print */
    table, th, td { border-color: #000 !important; }
    
    /* Force white background */
    body { background: white !important; }
  }

Wrap the entire printable quotation layout in:
  <div id="quotation-print-area">...</div>

### Step 2: Download Button
In QuotationPreview, add a "Download PDF" button alongside the Print button:

  const handleDownloadPDF = () => {
    // Set document title so the saved file is named properly
    const originalTitle = document.title;
    document.title = `Quotation-${quotation.quotationNumber}`;
    window.print();
    // Restore title after print dialog closes
    setTimeout(() => { document.title = originalTitle; }, 1000);
  };

  <button onClick={handleDownloadPDF} className="...">
    ⬇ Download PDF
  </button>

The user selects "Save as PDF" in the browser's print dialog.
On mobile (Chrome/Safari): the print dialog has a native "Save to Files" / "Save as PDF" option.

### Step 3: Auto-filename via quotation number
Set document.title = `Quotation-${quotationNumber}-${customerName}` before print 
so the default filename in the Save PDF dialog is meaningful, e.g.:
  Quotation-PVF-2026-0001-Abhishek_Kumar.pdf

### Step 4: Print button vs Download button
Show two separate buttons in the action bar:
  - 🖨 Print  → window.print() with original document title (for direct printer)
  - ⬇ Download PDF → window.print() with custom title set for filename

Both buttons have class="no-print" so they don't appear in the PDF itself.

### QuotationPreview print layout (A4 design)
The #quotation-print-area should render as a clean A4 document:
  - Font: 12px base, firm name 20px bold
  - Header: firm name (large) | GSTIN + Mobile right-aligned
  - Divider line
  - "QUOTATION" centered, letter-spacing wide
  - Quote No + Date on one row, Valid Until if set
  - Customer block: left-aligned, bordered box
  - Items: full-width bordered table, alternating row shading (use print-safe light grey)
  - Summary: right-aligned table, 200px wide
  - Footer: centered italic "Thanking you for your business"
  - Stamp/signature area: two columns "Authorised Signatory" | "Customer Signature"

---

## MOBILE ACTION BAR ON PREVIEW PAGE
On mobile, the Print + Download PDF + Edit buttons should be in a fixed bottom bar:

  <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 
                  flex gap-2 no-print lg:hidden">
    <button className="flex-1 ...">⬇ Download PDF</button>
    <button className="flex-1 ...">🖨 Print</button>
    <button className="flex-1 ...">✏ Edit</button>
  </div>

On lg: (desktop), show the buttons at the top of the page in a no-print bar.

---

## UPDATED DELIVERABLES (additions only)
client/src/
  styles/print.css          ← import in main.jsx
  components/MobileDrawer.jsx    ← sidebar drawer for mobile
  components/QuotationCard.jsx   ← card view for mobile list
  components/ItemCardMobile.jsx  ← item entry card for mobile form
  components/ActionBar.jsx       ← sticky bottom bar (mobile) / top bar (desktop)