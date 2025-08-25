import api from '../api/client';
import { Order } from '../types';

interface DocumentOptions {
  template?: 'receipt' | 'invoice' | 'quote';
  language?: string;
  currency?: string;
  logo?: boolean;
}

class DocumentService {
  async generateOrderReceipt(orderId: string, options: DocumentOptions = {}): Promise<{ pdfUrl: string }> {
    try {
      const { data } = await api.post(`/documents/orders/${orderId}/receipt`, options);
      return data;
    } catch (error) {
      console.error('Error generating order receipt:', error);
      throw error;
    }
  }

  async generateInvoice(orderId: string, options: DocumentOptions = {}): Promise<{ pdfUrl: string }> {
    try {
      const { data } = await api.post(`/documents/orders/${orderId}/invoice`, options);
      return data;
    } catch (error) {
      console.error('Error generating invoice:', error);
      throw error;
    }
  }

  async generateQuote(items: Array<{ productId: string; quantity: number }>, options: DocumentOptions = {}): Promise<{
    pdfUrl: string;
    quoteId: string;
  }> {
    try {
      const { data } = await api.post('/documents/quotes', { items, ...options });
      return data;
    } catch (error) {
      console.error('Error generating quote:', error);
      throw error;
    }
  }

  async downloadDocument(url: string): Promise<Blob> {
    try {
      const response = await fetch(url);
      return await response.blob();
    } catch (error) {
      console.error('Error downloading document:', error);
      throw error;
    }
  }

  async emailDocument(documentId: string, email: string, type: DocumentOptions['template'] = 'receipt'): Promise<{
    success: boolean;
    messageId?: string;
  }> {
    try {
      const { data } = await api.post('/documents/email', {
        documentId,
        email,
        type,
      });
      return data;
    } catch (error) {
      console.error('Error emailing document:', error);
      throw error;
    }
  }
}

export const documentService = new DocumentService();
export default documentService;
