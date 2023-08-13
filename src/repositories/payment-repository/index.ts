import { prisma } from '@/config';
import { Payment } from '@prisma/client';
import { PrismaAPI } from '../../utils/prisma-utils';

async function findPaymentByTicketId(ticketId: number) {
  return prisma.payment.findFirst({
    where: {
      ticketId,
    },
  });
}

async function createPayment(ticketId: number, params: PaymentParams, tx: PrismaAPI = prisma) {
  return tx.payment.create({
    data: {
      ticketId,
      ...params,
    },
  });
}

export type PaymentParams = Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>;

const paymentRepository = {
  findPaymentByTicketId,
  createPayment,
};

export default paymentRepository;
