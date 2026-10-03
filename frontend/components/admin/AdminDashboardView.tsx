"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  Phone,
  Mail,
  MessageSquare,
  Search,
  Filter,
  Download,
  RefreshCw,
  LogOut,
  Building,
  MapPin,
  Calendar,
  Layers,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  User,
  FileText,
  Package,
  ExternalLink,
  ChevronDown,
  X,
  Edit3,
  Briefcase,
  Sparkles,
} from "lucide-react";
import { api } from "@/lib/api";
import { AdminLeadItem, AdminStats, AdminUser } from "@/types";
import { SITE_CONFIG } from "@/lib/config";

export default function AdminDashboardView() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [leads, setLeads] = useState<AdminLeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "quote" | "sample" | "distributor" | "contact">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedLead, setSelectedLead] = useState<AdminLeadItem | null>(null);
  const [editingNotes, setEditingNotes] = useState(false);
  const [internalNotesText, setInternalNotesText] = useState("");
  const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Show temporary toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadDashboardData = useCallback(async (authToken: string) => {
    setRefreshing(true);
    try {
      const [statsData, leadsData] = await Promise.all([
        api.adminGetStats(authToken),
        api.adminGetLeads(authToken),
      ]);
      setStats(statsData);
      setLeads(leadsData.items);
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
      if (err?.message?.includes("401") || err?.message?.includes("credentials")) {
        localStorage.removeItem("lioc_admin_token");
        localStorage.removeItem("lioc_admin_user");
        router.push("/admin/login");
      } else {
        showToast("Error connecting to server. Please ensure backend is running.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  // Auth verification on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("lioc_admin_token");
    const savedUser = localStorage.getItem("lioc_admin_user");

    if (!savedToken) {
      router.push("/admin/login");
      return;
    }

    setToken(savedToken);
    if (savedUser) {
      try {
        setAdminUser(JSON.parse(savedUser));
      } catch {
        // Ignore
      }
    }

    loadDashboardData(savedToken);
  }, [router, loadDashboardData]);

  const handleLogout = () => {
    localStorage.removeItem("lioc_admin_token");
    localStorage.removeItem("lioc_admin_user");
    router.push("/admin/login");
  };

  // Filter leads based on active tab, search, and status
  const filteredLeads = useMemo(() => {
    return leads.filter((item) => {
      // Tab filter
      if (activeTab !== "all" && item.lead_type !== activeTab) {
        return false;
      }
      // Status filter
      if (statusFilter !== "ALL" && item.status !== statusFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(q);
        const matchCompany = item.company_name?.toLowerCase().includes(q) || false;
        const matchPhone = item.phone_number.toLowerCase().includes(q);
        const matchEmail = item.email.toLowerCase().includes(q);
        const matchRef = item.reference_id.toLowerCase().includes(q);
        const matchCity = item.city.toLowerCase().includes(q);
        const matchProduct = item.product_or_subject?.toLowerCase().includes(q) || false;
        return (
          matchName ||
          matchCompany ||
          matchPhone ||
          matchEmail ||
          matchRef ||
          matchCity ||
          matchProduct
        );
      }
      return true;
    });
  }, [leads, activeTab, statusFilter, searchQuery]);

  // Handle status update
  const handleStatusChange = async (lead: AdminLeadItem, newStatus: string) => {
    if (!token) return;
    setUpdatingStatusId(lead.id);
    try {
      await api.adminUpdateLeadStatus(token, lead.lead_type, lead.id, newStatus, lead.internal_notes || undefined);
      setLeads((prev) =>
        prev.map((item) =>
          item.id === lead.id && item.lead_type === lead.lead_type
            ? { ...item, status: newStatus, updated_at: new Date().toISOString() }
            : item
        )
      );
      if (selectedLead?.id === lead.id) {
        setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
      showToast(`Status updated to ${newStatus} for ${lead.reference_id}`);
    } catch (err) {
      showToast("Failed to update status. Please try again.");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // Handle saving notes
  const handleSaveNotes = async () => {
    if (!selectedLead || !token) return;
    try {
      await api.adminUpdateLeadStatus(
        token,
        selectedLead.lead_type,
        selectedLead.id,
        selectedLead.status,
        internalNotesText
      );
      setLeads((prev) =>
        prev.map((item) =>
          item.id === selectedLead.id && item.lead_type === selectedLead.lead_type
            ? { ...item, internal_notes: internalNotesText }
            : item
        )
      );
      setSelectedLead((prev) => (prev ? { ...prev, internal_notes: internalNotesText } : null));
      setEditingNotes(false);
      showToast("Internal notes saved successfully.");
    } catch (err) {
      showToast("Failed to save notes.");
    }
  };

  // Export to CSV directly in browser
  const handleExportCSV = () => {
    if (filteredLeads.length === 0) {
      showToast("No leads available to export in current view.");
      return;
    }

    const headers = [
      "Reference ID",
      "Type",
      "Date",
      "Name",
      "Company",
      "Phone",
      "Email",
      "City",
      "State",
      "Business Type",
      "Product / Requirement",
      "Quantity / Detail",
      "Monthly Requirement",
      "GST / Experience",
      "Status",
      "Internal Notes",
      "Customer Message",
    ];

    const rows = filteredLeads.map((l) => [
      `"${l.reference_id}"`,
      `"${l.lead_type.toUpperCase()}"`,
      `"${new Date(l.created_at).toLocaleString("en-IN")}"`,
      `"${(l.name || "").replace(/"/g, '""')}"`,
      `"${(l.company_name || "").replace(/"/g, '""')}"`,
      `"${l.phone_number}"`,
      `"${l.email}"`,
      `"${l.city || ""}"`,
      `"${l.state || ""}"`,
      `"${(l.business_type || "").replace(/"/g, '""')}"`,
      `"${(l.product_or_subject || "").replace(/"/g, '""')}"`,
      `"${(l.quantity_or_detail || "").replace(/"/g, '""')}"`,
      `"${(l.monthly_requirement || "").replace(/"/g, '""')}"`,
      `"${(l.gst_number || l.experience || "").replace(/"/g, '""')}"`,
      `"${l.status}"`,
      `"${(l.internal_notes || "").replace(/"/g, '""')}"`,
      `"${(l.message || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Lioc_Customer_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("CSV export downloaded successfully.");
  };

  // WhatsApp reply link generator
  const getWhatsAppReplyUrl = (lead: AdminLeadItem) => {
    let cleanPhone = lead.phone_number.replace(/[^0-9]/g, "");
    if (cleanPhone.length === 10) cleanPhone = "91" + cleanPhone;

    let greeting = `Hello ${lead.name},\n\nThank you for reaching out to Lioc Commercial Hygiene Products regarding inquiry [${lead.reference_id}].\n\n`;
    if (lead.lead_type === "quote") {
      greeting += `We received your bulk quotation request for ${lead.product_or_subject || "our commercial chemical supplies"}. I would be pleased to provide customized factory rates.`;
    } else if (lead.lead_type === "sample") {
      greeting += `We received your request for an evaluation sample kit (${lead.product_or_subject || "Commercial evaluation"}). We are preparing the dispatch to your business location.`;
    } else if (lead.lead_type === "distributor") {
      greeting += `We received your application for dealership & regional distribution in ${lead.city || "your territory"}. We would love to discuss partner margins and supply logistics.`;
    } else {
      greeting += `We received your inquiry regarding "${lead.product_or_subject || "our products"}". How can we assist your facility today?`;
    }

    greeting += `\n\nWarm regards,\nManagement Team\nLioc Hygiene Solutions\nWebsite: https://lioc.in`;

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(greeting)}`;
  };

  // Email reply link generator
  const getEmailReplyUrl = (lead: AdminLeadItem) => {
    const subject = `Lioc Commercial Supplies — Response to Inquiry [${lead.reference_id}]`;
    const body = `Dear ${lead.name},\n\nThank you for connecting with Lioc Commercial Hygiene.\n\nRegarding your request for ${lead.product_or_subject || "our commercial range"} (Ref: ${lead.reference_id}), we are glad to assist.\n\n[Please insert specific quotation / details here]\n\nBest Regards,\nLioc Executive Desk\nKolkata, West Bengal\nPhone: +91 90073 81804 | Email: lioccalcutta@gmail.com`;
    return `mailto:${lead.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Helper for Status Badge Styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return "bg-emerald-100 text-emerald-800 border-emerald-300 font-extrabold";
      case "PENDING":
        return "bg-amber-100 text-amber-800 border-amber-300 font-extrabold";
      case "CONTACTED":
        return "bg-blue-100 text-blue-800 border-blue-300 font-bold";
      case "QUOTATION_SENT":
        return "bg-purple-100 text-purple-800 border-purple-300 font-bold";
      case "APPROVED":
      case "CONVERTED":
        return "bg-teal-100 text-teal-800 border-teal-300 font-bold";
      case "REJECTED":
      case "LOST":
        return "bg-rose-100 text-rose-800 border-rose-300 font-medium";
      default:
        return "bg-slate-100 text-slate-700 border-slate-300";
    }
  };

  // Helper for Lead Type Badge
  const getLeadTypeBadge = (type: string) => {
    switch (type) {
      case "quote":
        return { label: "Bulk Quote (RFQ)", bg: "bg-teal-600 text-white" };
      case "sample":
        return { label: "Sample Kit", bg: "bg-indigo-600 text-white" };
      case "distributor":
        return { label: "Distributor", bg: "bg-amber-600 text-white" };
      case "contact":
        return { label: "Direct Inquiry", bg: "bg-slate-700 text-white" };
      default:
        return { label: type, bg: "bg-slate-600 text-white" };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="text-white text-lg font-bold">Accessing CEO Executive Dashboard...</div>
          <div className="text-slate-400 text-xs">Authenticating secure session</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-lioc-teal text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-2xl border border-teal-300 flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Executive Header */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-4 sm:px-8 py-3.5 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Logo & Portal Title */}
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-lioc-teal to-teal-400 flex items-center justify-center text-slate-950 shadow-md">
              <Shield className="w-5 h-5 font-black" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-black tracking-tight text-white">Lioc Executive Command Center</h1>
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-full">
                  CEO Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Connected Administrator: <span className="text-teal-300 font-bold">{adminUser?.email || "lioccalcutta@gmail.com"}</span> ({adminUser?.role || "Chief Executive Officer"})
              </p>
            </div>
          </div>

          {/* Action Header Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
            <button
              onClick={() => token && loadDashboardData(token)}
              disabled={refreshing}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all flex items-center space-x-1.5 shadow-sm"
              title="Refresh Leads & Stats"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-teal-400 ${refreshing ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-teal-950 hover:bg-teal-900 text-teal-200 text-xs font-semibold rounded-xl border border-teal-700/50 transition-all flex items-center space-x-1.5 shadow-sm"
              title="Download Current Leads to Excel/CSV"
            >
              <Download className="w-3.5 h-3.5 text-teal-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold rounded-xl border border-rose-800/40 transition-all flex items-center space-x-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* KPI Metrics Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {/* Total Inquiries */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4.5 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-all">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate-400">Total Inquiries</span>
                <div className="p-2 bg-teal-500/10 rounded-xl text-teal-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white mt-2">
                {stats.total_inquiries}
              </div>
              <div className="text-[10px] text-slate-400 mt-1 flex items-center space-x-1">
                <span>All customer touchpoints</span>
              </div>
            </div>

            {/* Action Required / New */}
            <div className="bg-slate-900/70 border border-amber-900/40 bg-gradient-to-br from-amber-950/10 to-slate-900 rounded-2xl p-4.5 shadow-sm relative overflow-hidden group hover:border-amber-700/50 transition-all">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-amber-300">Action Required</span>
                <div className="p-2 bg-amber-500/20 rounded-xl text-amber-400 animate-pulse">
                  <AlertCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-2">
                {stats.action_required_count}
              </div>
              <div className="text-[10px] text-amber-200/70 mt-1">
                New quotes & pending samples
              </div>
            </div>

            {/* Bulk Quotes */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4.5 shadow-sm relative overflow-hidden group hover:border-teal-700/50 transition-all">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate-400">Bulk RFQ Quotes</span>
                <div className="p-2 bg-teal-500/10 rounded-xl text-teal-400">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-teal-400 mt-2">
                {stats.quotes_count}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Hot commercial pricing inquiries
              </div>
            </div>

            {/* Evaluation Samples */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4.5 shadow-sm relative overflow-hidden group hover:border-indigo-700/50 transition-all">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate-400">Sample Kits</span>
                <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
                  <Package className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-indigo-400 mt-2">
                {stats.samples_count}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Trial requests from kitchens/hotels
              </div>
            </div>

            {/* Distributor Applications */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4.5 shadow-sm relative overflow-hidden group hover:border-amber-700/50 transition-all col-span-2 lg:col-span-1">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate-400">Distributors</span>
                <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400">
                  <Briefcase className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-2">
                {stats.distributors_count}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Dealership partner applications
              </div>
            </div>
          </div>
        )}

        {/* Controls: Tabs & Search Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
          {/* Tabs Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  activeTab === "all"
                    ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <span>All Inquiries</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-900/50 text-current">
                  {leads.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("quote")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  activeTab === "quote"
                    ? "bg-teal-500 text-slate-950 shadow-md"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <span>Bulk Quotes</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-900/50 text-current">
                  {leads.filter((l) => l.lead_type === "quote").length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("sample")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  activeTab === "sample"
                    ? "bg-teal-500 text-slate-950 shadow-md"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <span>Sample Kits</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-900/50 text-current">
                  {leads.filter((l) => l.lead_type === "sample").length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("distributor")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  activeTab === "distributor"
                    ? "bg-teal-500 text-slate-950 shadow-md"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <span>Distributors</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-900/50 text-current">
                  {leads.filter((l) => l.lead_type === "distributor").length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("contact")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  activeTab === "contact"
                    ? "bg-teal-500 text-slate-950 shadow-md"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <span>Direct Contact</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-900/50 text-current">
                  {leads.filter((l) => l.lead_type === "contact").length}
                </span>
              </button>
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400 font-medium">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-teal-400"
              >
                <option value="ALL">All Statuses</option>
                <option value="NEW">NEW</option>
                <option value="PENDING">PENDING</option>
                <option value="CONTACTED">CONTACTED</option>
                <option value="QUOTATION_SENT">QUOTATION_SENT</option>
                <option value="APPROVED">APPROVED</option>
                <option value="CONVERTED">CONVERTED</option>
                <option value="REJECTED">REJECTED / LOST</option>
              </select>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by customer name, company, phone number, email, reference ID, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Customer Inquiries Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-slate-800 flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Customer Inquiries & Leads</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/30">
                  {filteredLeads.length} items
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Live submissions from Website RFQ, Samples, Dealerships & Contact Forms
              </p>
            </div>
          </div>

          {filteredLeads.length === 0 ? (
            <div className="p-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <div className="text-slate-300 text-sm font-semibold">No inquiries found matching criteria</div>
              <div className="text-slate-500 text-xs max-w-md mx-auto">
                Try adjusting your search query, status dropdown, or selecting a different tab.
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-bold text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Ref ID & Date</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4">Customer & Business</th>
                    <th className="py-3.5 px-4">Requirement / Product</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-center">Quick Actions (Call / WhatsApp / Email)</th>
                    <th className="py-3.5 px-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredLeads.map((lead) => {
                    const badge = getLeadTypeBadge(lead.lead_type);
                    return (
                      <tr
                        key={`${lead.lead_type}-${lead.id}`}
                        className="hover:bg-slate-800/40 transition-colors group"
                      >
                        {/* Reference ID & Date */}
                        <td className="py-4 px-4 align-top">
                          <div className="font-mono font-bold text-teal-300 text-xs">
                            {lead.reference_id}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-1 flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-slate-500 flex-shrink-0" />
                            <span>{new Date(lead.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                          </div>
                        </td>

                        {/* Lead Type */}
                        <td className="py-4 px-4 align-top">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${badge.bg} shadow-xs`}>
                            {badge.label}
                          </span>
                        </td>

                        {/* Customer / Company Info */}
                        <td className="py-4 px-4 align-top max-w-xs">
                          <div className="font-bold text-white text-sm">
                            {lead.name}
                          </div>
                          {lead.company_name && lead.company_name !== "N/A" && (
                            <div className="text-slate-300 font-semibold flex items-center space-x-1 mt-0.5">
                              <Building className="w-3 h-3 text-slate-400 flex-shrink-0" />
                              <span className="truncate">{lead.company_name}</span>
                            </div>
                          )}
                          <div className="text-slate-400 text-[11px] flex items-center space-x-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                            <span>{lead.city}{lead.state ? `, ${lead.state}` : ""}</span>
                            {lead.business_type && (
                              <span className="text-slate-500"> • {lead.business_type}</span>
                            )}
                          </div>
                        </td>

                        {/* Requirements / Products */}
                        <td className="py-4 px-4 align-top max-w-sm">
                          <div className="font-semibold text-slate-200 line-clamp-2">
                            {lead.product_or_subject || "General Commercial Inquiry"}
                          </div>
                          {lead.quantity_or_detail && (
                            <div className="text-amber-400 text-[11px] font-medium mt-0.5">
                              Volume: <span className="font-bold">{lead.quantity_or_detail}</span>
                            </div>
                          )}
                          {lead.monthly_requirement && (
                            <div className="text-slate-400 text-[10px] mt-0.5">
                              Monthly Need: {lead.monthly_requirement}
                            </div>
                          )}
                          {lead.gst_number && (
                            <div className="text-teal-300 font-mono text-[10px] mt-0.5">
                              GST: {lead.gst_number}
                            </div>
                          )}
                          {lead.message && (
                            <div className="text-slate-400 italic text-[11px] mt-1 line-clamp-1 border-l-2 border-slate-700 pl-2">
                              &ldquo;{lead.message}&rdquo;
                            </div>
                          )}
                        </td>

                        {/* Status Dropdown */}
                        <td className="py-4 px-4 align-top">
                          <div className="relative">
                            <select
                              value={lead.status}
                              disabled={updatingStatusId === lead.id}
                              onChange={(e) => handleStatusChange(lead, e.target.value)}
                              className={`text-[11px] rounded-xl px-2.5 py-1 border shadow-xs appearance-none pr-6 cursor-pointer focus:outline-none transition-all ${getStatusBadge(
                                lead.status
                              )}`}
                            >
                              <option value="NEW">NEW</option>
                              <option value="PENDING">PENDING</option>
                              <option value="CONTACTED">CONTACTED</option>
                              <option value="QUOTATION_SENT">QUOTATION_SENT</option>
                              <option value="APPROVED">APPROVED</option>
                              <option value="CONVERTED">CONVERTED</option>
                              <option value="REJECTED">REJECTED</option>
                              <option value="LOST">LOST</option>
                            </select>
                            <ChevronDown className="w-3 h-3 text-current absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </td>

                        {/* Action Buttons (Call, WhatsApp, Email) */}
                        <td className="py-4 px-4 align-top">
                          <div className="flex items-center justify-center space-x-2">
                            {/* Call Button */}
                            <a
                              href={`tel:${lead.phone_number.replace(/[^0-9+]/g, "")}`}
                              className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-slate-700 hover:border-emerald-500 transition-all shadow-sm flex items-center space-x-1"
                              title={`Call ${lead.name} (${lead.phone_number})`}
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>

                            {/* WhatsApp Reply Button */}
                            <a
                              href={getWhatsAppReplyUrl(lead)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-slate-700 hover:border-emerald-400 transition-all shadow-sm flex items-center space-x-1 font-bold"
                              title={`Reply via WhatsApp with pre-filled message`}
                            >
                              <MessageSquare className="w-3.5 h-3.5 fill-current" />
                            </a>

                            {/* Email Reply Button */}
                            <a
                              href={getEmailReplyUrl(lead)}
                              className="p-2 rounded-xl bg-slate-800 hover:bg-teal-600 text-teal-300 hover:text-white border border-slate-700 hover:border-teal-500 transition-all shadow-sm flex items-center space-x-1"
                              title={`Send Email to ${lead.email}`}
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>

                        {/* View Details / Modal */}
                        <td className="py-4 px-4 align-top text-right">
                          <button
                            onClick={() => {
                              setSelectedLead(lead);
                              setInternalNotesText(lead.internal_notes || "");
                              setEditingNotes(false);
                            }}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 text-xs font-semibold transition-all shadow-sm"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Detail & Notes Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col justify-between">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-teal-400 text-sm">
                    {selectedLead.reference_id}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getLeadTypeBadge(selectedLead.lead_type).bg}`}>
                    {getLeadTypeBadge(selectedLead.lead_type).label}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(selectedLead.status)}`}>
                    {selectedLead.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  {selectedLead.name}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedLead.company_name ? `${selectedLead.company_name} • ` : ""}{selectedLead.city}
                </p>
              </div>

              <button
                onClick={() => setSelectedLead(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 text-xs">
              {/* Contact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Phone Number</span>
                  <div className="font-bold text-white text-sm flex items-center space-x-2">
                    <span>{selectedLead.phone_number}</span>
                    <a
                      href={`tel:${selectedLead.phone_number.replace(/[^0-9+]/g, "")}`}
                      className="text-teal-400 hover:underline text-xs"
                    >
                      (Call)
                    </a>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Email Address</span>
                  <div className="font-bold text-white text-sm truncate">
                    <a href={`mailto:${selectedLead.email}`} className="text-teal-400 hover:underline">
                      {selectedLead.email}
                    </a>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Location</span>
                  <div className="font-semibold text-slate-200">
                    {selectedLead.city}{selectedLead.state ? `, ${selectedLead.state}` : ""}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Date Received</span>
                  <div className="font-semibold text-slate-200">
                    {new Date(selectedLead.created_at).toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              {/* Requirement Details */}
              <div className="space-y-3">
                <h4 className="font-bold text-white text-sm border-b border-slate-800 pb-2">
                  Customer Requirement & Specifications
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Product / Subject</span>
                    <p className="text-slate-200 font-semibold mt-0.5">
                      {selectedLead.product_or_subject || "N/A"}
                    </p>
                  </div>

                  {selectedLead.quantity_or_detail && (
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold">Quantity / Volume</span>
                      <p className="text-amber-400 font-bold mt-0.5">
                        {selectedLead.quantity_or_detail}
                      </p>
                    </div>
                  )}

                  {selectedLead.monthly_requirement && (
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold">Expected Monthly Requirement</span>
                      <p className="text-slate-200 font-semibold mt-0.5">
                        {selectedLead.monthly_requirement}
                      </p>
                    </div>
                  )}

                  {selectedLead.business_type && (
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold">Business Sector</span>
                      <p className="text-slate-200 font-semibold mt-0.5">
                        {selectedLead.business_type}
                      </p>
                    </div>
                  )}

                  {selectedLead.business_address && (
                    <div className="col-span-2">
                      <span className="text-slate-400 text-[10px] uppercase font-bold">Delivery / Facility Address</span>
                      <p className="text-slate-200 font-semibold mt-0.5">
                        {selectedLead.business_address}
                      </p>
                    </div>
                  )}

                  {selectedLead.gst_number && (
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold">GST Number</span>
                      <p className="text-teal-300 font-mono font-bold mt-0.5">
                        {selectedLead.gst_number}
                      </p>
                    </div>
                  )}

                  {selectedLead.investment_capacity && (
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold">Investment Capacity</span>
                      <p className="text-amber-400 font-bold mt-0.5">
                        {selectedLead.investment_capacity}
                      </p>
                    </div>
                  )}

                  {selectedLead.experience && (
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold">Distribution Experience</span>
                      <p className="text-slate-200 font-semibold mt-0.5">
                        {selectedLead.experience}
                      </p>
                    </div>
                  )}
                </div>

                {selectedLead.message && (
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1 mt-3">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Customer Message</span>
                    <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                      {selectedLead.message}
                    </p>
                  </div>
                )}
              </div>

              {/* Internal CEO Notes Section */}
              <div className="space-y-3 border-t border-slate-800 pt-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-white text-sm flex items-center space-x-1.5">
                    <Edit3 className="w-4 h-4 text-teal-400" />
                    <span>Internal CEO / Sales Follow-up Notes</span>
                  </h4>
                  {!editingNotes && (
                    <button
                      onClick={() => setEditingNotes(true)}
                      className="text-xs text-teal-400 hover:underline font-semibold"
                    >
                      {selectedLead.internal_notes ? "Edit Notes" : "+ Add Note"}
                    </button>
                  )}
                </div>

                {editingNotes ? (
                  <div className="space-y-2">
                    <textarea
                      rows={3}
                      value={internalNotesText}
                      onChange={(e) => setInternalNotesText(e.target.value)}
                      placeholder="Write internal notes, quotation numbers, dispatch tracking info, or team follow-up reminders..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-teal-400"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveNotes}
                        className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl shadow-sm"
                      >
                        Save Note
                      </button>
                      <button
                        onClick={() => setEditingNotes(false)}
                        className="px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold rounded-xl"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 text-slate-300 italic">
                    {selectedLead.internal_notes || "No internal notes recorded yet."}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer Quick Communication Bar */}
            <div className="p-6 border-t border-slate-800 bg-slate-950/50 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <span className="text-slate-400 text-xs font-semibold">Change Status:</span>
                <select
                  value={selectedLead.status}
                  onChange={(e) => handleStatusChange(selectedLead, e.target.value)}
                  className={`text-xs rounded-xl px-3 py-2 border font-bold ${getStatusBadge(selectedLead.status)}`}
                >
                  <option value="NEW">NEW</option>
                  <option value="PENDING">PENDING</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="QUOTATION_SENT">QUOTATION_SENT</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="CONVERTED">CONVERTED</option>
                  <option value="REJECTED">REJECTED</option>
                  <option value="LOST">LOST</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                <a
                  href={`tel:${selectedLead.phone_number.replace(/[^0-9+]/g, "")}`}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-xl font-bold flex items-center space-x-1.5 transition-all text-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>

                <a
                  href={getWhatsAppReplyUrl(selectedLead)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center space-x-1.5 transition-all text-xs shadow-md"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-current" />
                  <span>WhatsApp Reply</span>
                </a>

                <a
                  href={getEmailReplyUrl(selectedLead)}
                  className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold flex items-center space-x-1.5 transition-all text-xs"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Reply</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
