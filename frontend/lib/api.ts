import {
  Category,
  Industry,
  ProductListItem,
  ProductDetail,
  LeadSubmissionResponse,
  QuoteFormData,
  SampleFormData,
  DistributorFormData,
  ContactFormData,
  AdminAuthResponse,
  AdminUser,
  AdminStats,
  AdminLeadsResponse,
  ProductFinderOptions,
  ProductFinderResponse,
  FacilityAuditRequest,
  FacilityAuditResponse,
  AuditLeadSubmit,
} from "@/types";
import { SITE_CONFIG } from "./config";

const API_BASE = SITE_CONFIG.apiUrl;

async function fetchWithError<T>(url: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const res = await fetch(url, {
      ...options,
      signal: options?.signal || controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      cache: "no-store",
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      let errorDetail = "API request failed";
      try {
        const errorJson = await res.json();
        errorDetail = errorJson.error?.message || errorJson.detail || errorJson.message || errorDetail;
      } catch {
        errorDetail = `HTTP ${res.status}: ${res.statusText}`;
      }
      throw new Error(errorDetail);
    }

    return res.json();
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

export const api = {
  // Catalog
  async getCategories(): Promise<Category[]> {
    try {
      return await fetchWithError<Category[]>(`${API_BASE}/categories`);
    } catch (e) {
      console.warn("Backend API not reachable for categories, using fallback data:", e);
      return [];
    }
  },

  async getIndustries(): Promise<Industry[]> {
    try {
      return await fetchWithError<Industry[]>(`${API_BASE}/industries`);
    } catch (e) {
      console.warn("Backend API not reachable for industries, using fallback data:", e);
      return [];
    }
  },

  async getIndustryBySlug(slug: string): Promise<Industry | null> {
    try {
      return await fetchWithError<Industry>(`${API_BASE}/industries/${slug}`);
    } catch (e) {
      console.warn(`Backend API failed for industry ${slug}:`, e);
      return null;
    }
  },

  async getProducts(params?: {
    category?: string;
    industry?: string;
    featured?: boolean;
    bestseller?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<ProductListItem[]> {
    try {
      const query = new URLSearchParams();
      if (params?.category) query.set("category", params.category);
      if (params?.industry) query.set("industry", params.industry);
      if (params?.featured !== undefined) query.set("featured", String(params.featured));
      if (params?.bestseller !== undefined) query.set("bestseller", String(params.bestseller));
      if (params?.search) query.set("search", params.search);
      if (params?.limit !== undefined) query.set("limit", String(params.limit));
      if (params?.offset !== undefined) query.set("offset", String(params.offset));

      const qs = query.toString();
      const url = `${API_BASE}/products${qs ? `?${qs}` : ""}`;
      return await fetchWithError<ProductListItem[]>(url);
    } catch (e) {
      console.warn("Backend API not reachable for products:", e);
      return [];
    }
  },

  async getProductBySlug(slug: string): Promise<ProductDetail | null> {
    try {
      return await fetchWithError<ProductDetail>(`${API_BASE}/products/${slug}`);
    } catch (e) {
      console.warn(`Backend API failed for product ${slug}:`, e);
      return null;
    }
  },

  // ---------------- Product Finder Engine ----------------
  async getProductFinderOptions(): Promise<ProductFinderOptions> {
    try {
      return await fetchWithError<ProductFinderOptions>(`${API_BASE}/product-finder/options`);
    } catch (e) {
      console.warn("Backend API not reachable for product finder options:", e);
      return { industries: [], categories: [], context_challenges: [] };
    }
  },

  async getProductRecommendations(params: {
    industryId?: number;
    categoryId?: number;
    context?: string;
    limit?: number;
  }): Promise<ProductFinderResponse> {
    const query = new URLSearchParams();
    if (params.industryId) query.set("industry_id", String(params.industryId));
    if (params.categoryId) query.set("category_id", String(params.categoryId));
    if (params.context) query.set("context", params.context);
    if (params.limit) query.set("limit", String(params.limit));

    const qs = query.toString();
    const url = `${API_BASE}/product-finder/recommendations${qs ? `?${qs}` : ""}`;
    return await fetchWithError<ProductFinderResponse>(url);
  },

  // Lead Generation & Submissions
  async submitQuote(data: QuoteFormData): Promise<LeadSubmissionResponse> {
    return await fetchWithError<LeadSubmissionResponse>(`${API_BASE}/quotes`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async submitSample(data: SampleFormData): Promise<LeadSubmissionResponse> {
    return await fetchWithError<LeadSubmissionResponse>(`${API_BASE}/samples`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async submitDistributor(data: DistributorFormData): Promise<LeadSubmissionResponse> {
    return await fetchWithError<LeadSubmissionResponse>(`${API_BASE}/distributors`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async submitContact(data: ContactFormData): Promise<LeadSubmissionResponse> {
    return await fetchWithError<LeadSubmissionResponse>(`${API_BASE}/contact`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // ---------------- AI Virtual Hygiene Auditor ----------------
  async calculateAudit(data: FacilityAuditRequest): Promise<FacilityAuditResponse> {
    return await fetchWithError<FacilityAuditResponse>(`${API_BASE}/auditor/calculate`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async submitAudit(data: AuditLeadSubmit): Promise<LeadSubmissionResponse> {
    return await fetchWithError<LeadSubmissionResponse>(`${API_BASE}/auditor/submit`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // ---------------- CEO & Admin Portal ----------------
  async adminLogin(email: string, password: string): Promise<AdminAuthResponse> {
    return await fetchWithError<AdminAuthResponse>(`${API_BASE}/admin/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async adminGetProfile(token: string): Promise<AdminUser> {
    return await fetchWithError<AdminUser>(`${API_BASE}/admin/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async adminGetStats(token: string): Promise<AdminStats> {
    return await fetchWithError<AdminStats>(`${API_BASE}/admin/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async adminGetLeads(
    token: string,
    params?: {
      leadType?: string;
      status?: string;
      search?: string;
    }
  ): Promise<AdminLeadsResponse> {
    const query = new URLSearchParams();
    if (params?.leadType && params.leadType !== "all") query.set("lead_type", params.leadType);
    if (params?.status && params.status !== "ALL") query.set("status", params.status);
    if (params?.search) query.set("search", params.search);

    const qs = query.toString();
    const url = `${API_BASE}/admin/leads${qs ? `?${qs}` : ""}`;

    return await fetchWithError<AdminLeadsResponse>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async adminUpdateLeadStatus(
    token: string,
    leadType: string,
    leadId: number,
    status: string,
    internalNotes?: string
  ): Promise<{ success: boolean; message: string }> {
    return await fetchWithError<{ success: boolean; message: string }>(
      `${API_BASE}/admin/leads/${leadType}/${leadId}/status`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, internal_notes: internalNotes }),
      }
    );
  },

  async adminDeleteLead(
    token: string,
    leadType: string,
    leadId: number
  ): Promise<{ success: boolean; message: string }> {
    return await fetchWithError<{ success: boolean; message: string }>(
      `${API_BASE}/admin/leads/${leadType}/${leadId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
};
