import { inject, Service } from '@angular/core';
import { Reward } from '../models/Reward';
import { environment } from '../../../../environments/environment.development';
import { ClaimRewardResponse } from '../models/ClaimRewardResponse';
import { HttpClient } from '@angular/common/http';

@Service()
export class RewardService {
  http = inject(HttpClient);

  getAvailableReward() {
    return this.http.get<Reward>(
      `${environment.apiUrl}/api/Rewards/available`
    );
  }

  claimReward(rewardId: string) {
    return this.http.post<ClaimRewardResponse>(
      `${environment.apiUrl}/api/Rewards/${rewardId}/claim`,
      {}
    );
  }
}
