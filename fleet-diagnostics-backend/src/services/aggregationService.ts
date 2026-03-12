import { aggregationRepository } from "../repositories/aggregationRepository";
import { EventsByVehicle, EventsByCode, CriticalVehicle } from "../types";

export const aggregationService = {
  async getByVehicle(
    from?: string,
    to?: string,
    limit?: number,
  ): Promise<EventsByVehicle[]> {
    return aggregationRepository.getByVehicle(from, to, limit);
  },

  async getByCode(
    from?: string,
    to?: string,
    limit?: number,
  ): Promise<EventsByCode[]> {
    return aggregationRepository.getByCode(from, to, limit);
  },

  async getCriticalVehicles(): Promise<CriticalVehicle[]> {
    return aggregationRepository.getCriticalVehicles();
  },
};
