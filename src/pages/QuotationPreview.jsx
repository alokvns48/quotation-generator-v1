import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import ActionBar from "../components/ActionBar";

const QuotationPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quotation, setQuotation] = useState(null);
  const [firm, setFirm] = useState(null);

  useEffect(() => {
    const load = async () => {
      const [quoteRes, firmRes] = await Promise.all([
        api.get(`/api/quotations/${id}`),
        api.get("/api/firm"),
      ]);
      setQuotation(quoteRes.data);
      setFirm(firmRes.data);
    };

    load();
  }, [id]);

  const summaryRows = useMemo(() => {
    if (!quotation) return [];

    if (quotation.taxConfig?.type === "exclusive") {
      const gst = Number(quotation.taxConfig?.gstPercent || 0);
      const sgst = Number(quotation.gstAmount || 0) / 2;
      return [
        ["Subtotal", `₹${Number(quotation.subtotal || 0).toFixed(2)}`],
        [`SGST ${gst / 2}%`, `₹${sgst.toFixed(2)}`],
        [`CGST ${gst / 2}%`, `₹${sgst.toFixed(2)}`],
        [
          `Total Tax (${gst}%)`,
          `₹${Number(quotation.gstAmount || 0).toFixed(2)}`,
        ],
        ["Grand Total", `₹${Number(quotation.grandTotal || 0).toFixed(2)}`],
      ];
    }

    if (quotation.taxConfig?.type === "inclusive") {
      return [
        [
          "Total (Incl. of all taxes)",
          `₹${Number(quotation.grandTotal || 0).toFixed(2)}`,
        ],
      ];
    }

    return [["Total", `₹${Number(quotation.grandTotal || 0).toFixed(2)}`]];
  }, [quotation]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    if (!quotation) return;

    const original = document.title;
    const customer = (quotation.customer?.name || "Customer").replace(
      /\s+/g,
      "_",
    );
    document.title = `Quotation-${quotation.quotationNumber}-${customer}`;
    window.print();
    setTimeout(() => {
      document.title = original;
    }, 1000);
  };

  const handleEdit = () => {
    navigate(`/quotations/${id}`);
  };

  const headerSizes = firm?.headerSizes || {};

  if (!quotation || !firm) {
    return <p className="text-gray-600">Loading preview...</p>;
  }

  return (
    <div className="space-y-4">
      <ActionBar
        onDownloadPDF={handleDownloadPDF}
        onPrint={handlePrint}
        onEdit={handleEdit}
      />

      <div className="overflow-x-auto">
        <div
          id="quotation-print-area"
          className="mx-auto w-[794px] max-w-full bg-white border border-gray-200 rounded-xl p-5 text-[12px] text-black"
        >
          <div className="flex min-h-[920px] flex-col">
            <header className="space-y-4 pt-4">
              <div className="flex items-start justify-between gap-4 font-bold uppercase leading-none">
                <p style={{ fontSize: `${headerSizes.gstin || 18}px` }}>
                  GSTIN NO: {firm.gstin || "-"}
                </p>
                <p
                  className="text-right"
                  style={{ fontSize: `${headerSizes.mobile || 18}px` }}
                >
                  MOB.NO. {firm.mobile || "-"}
                </p>
              </div>

              <div className="text-center space-y-2">
                <h1
                  className="font-semibold uppercase leading-none tracking-tight text-[#3f679f]"
                  style={{ fontSize: `${headerSizes.firmName || 46}px` }}
                >
                  {firm.firmName}
                </h1>
                <p
                  className="font-medium font-serif uppercase leading-tight tracking-[0.03em] text-[#2b5c70]"
                  style={{ fontSize: `${headerSizes.address || 24}px` }}
                >
                  {firm.address}
                </p>
                {firm.businessDomain ? (
                  <div
                    className="inline-block border border-gray-200 px-2 py-1 italic uppercase leading-none tracking-[0.02em] text-[#2b5c70]"
                    style={{
                      fontSize: `${headerSizes.businessDomain || 13}px`,
                    }}
                  >
                    Product of {firm.businessDomain}
                  </div>
                ) : null}
              </div>
            </header>

            <hr className="my-4 border-gray-200" />

            <h2 className="text-center text-[14px] font-semibold tracking-[0.4em]">
              QUOTATION
            </h2>

            <div className="mt-3 flex justify-between gap-3">
              <p>
                <strong>Quote No:</strong> {quotation.quotationNumber}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(quotation.date).toLocaleDateString()}
              </p>
            </div>

            <section className="mt-3 rounded-lg border border-gray-200 bg-white p-3">
              <p className="font-semibold mb-1">Customer</p>
              <p>
                <strong>Name:</strong> {quotation.customer?.name}
              </p>
              <p>
                <strong>Mobile No:</strong> {quotation.customer?.mobile}
              </p>
              <p>
                <strong>Address:</strong> {quotation.customer?.address}
              </p>
            </section>

            <div className="mt-3 rounded-lg border border-gray-200 bg-white overflow-hidden">
              <table className="w-full mt-0 border-collapse">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left border-b border-gray-200 first:rounded-tl-lg last:rounded-tr-lg first:pl-4">
                      Sl.No
                    </th>
                    <th className="px-3 py-2 text-left border-b border-gray-200">
                      Particulars
                    </th>
                    <th className="px-3 py-2 text-left border-b border-gray-200">
                      Unit
                    </th>
                    <th className="px-3 py-2 text-right border-b border-gray-200">
                      Qty
                    </th>
                    <th className="px-3 py-2 text-right border-b border-gray-200">
                      Rate
                    </th>
                    <th className="px-3 py-2 text-right border-b border-gray-200 first:pr-4 last:pr-4">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(quotation.items || []).map((item, index) => (
                    <tr
                      key={index}
                      className={index % 2 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="px-3 py-1.5 border-l border-b border-gray-200 first:pl-4">
                        {item.slNo || index + 1}
                      </td>
                      <td className="px-3 py-1.5 border-l border-b border-gray-200">
                        {item.particulars}
                      </td>
                      <td className="px-3 py-1.5 border-l border-b border-gray-200">
                        {item.unit}
                      </td>
                      <td className="px-3 py-1.5 border-l border-b border-gray-200 text-right">
                        {item.quantity}
                      </td>
                      <td className="px-3 py-1.5 border-l border-b border-gray-200 text-right">
                        ₹{Number(item.rate).toFixed(2)}
                      </td>
                      <td className="px-3 py-1.5 border-l border-b border-gray-200 text-right first:pr-4 last:pr-4">
                        ₹{Number(item.amount).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-3 w-full">
              <div className="w-full rounded-lg border border-gray-200 bg-white">
                <table className="w-full">
                  <tbody>
                    {summaryRows.map(([label, value], index) => (
                      <tr
                        key={label}
                        className={
                          index === summaryRows.length - 1 ? "font-bold" : ""
                        }
                      >
                        <td className="border-b border-gray-100 px-2 py-1.5">
                          {label}
                        </td>
                        <td className="border-b border-gray-100 px-2 py-1.5 text-right">
                          {value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {quotation.notes ? (
              <section className="mt-3">
                <p className="font-semibold">Notes</p>
                <p>{quotation.notes}</p>
              </section>
            ) : null}

            <div className="mt-auto pt-6">
              <p className="text-center italic">
                Thanking you for your business
              </p>

              <div className="mt-6 grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="border-t border-gray-200 pt-2">
                    Authorised Signatory
                  </div>
                </div>
                <div className="text-center">
                  <div className="border-t border-gray-200 pt-2">
                    Customer Signature
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationPreview;
