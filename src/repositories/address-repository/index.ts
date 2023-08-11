import { prisma } from '@/config';
import { PrismaAPI } from '../../utils/prisma-utils';
import { Address } from '@prisma/client';

async function upsert(
  enrollmentId: number,
  createdAddress: CreateAddressParams,
  updatedAddress: UpdateAddressParams,
  tx: PrismaAPI = prisma,
) {
  return tx.address.upsert({
    where: {
      enrollmentId,
    },
    create: {
      ...createdAddress,
      Enrollment: { connect: { id: enrollmentId } },
    },
    update: updatedAddress,
  });
}

export type CreateAddressParams = Omit<Address, 'id' | 'createdAt' | 'updatedAt' | 'enrollmentId'>;
export type UpdateAddressParams = CreateAddressParams;

const addressRepository = {
  upsert,
};

export default addressRepository;
