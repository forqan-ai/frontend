import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { WalletService } from '../../services/wallet.service';
import { PayoutMethod, PayoutMethodLabel } from '../../wallet.models';

@Component({
  selector: 'app-withdrawal-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './withdrawal-request.component.html',
  styleUrl: './withdrawal-request.component.css',
})
export class WithdrawalRequestComponent implements OnInit {
  private fb = inject(FormBuilder);
  private walletService = inject(WalletService);

  readonly payoutMethodLabel = PayoutMethodLabel;
  readonly PayoutMethod = PayoutMethod;

  form!: FormGroup;
  idempotencyKey = '';
  submitting = false;
  error = '';
  successMessage = '';

  ngOnInit(): void {
    this.buildForm();
    this.regenerateKey();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      amount: [null, [Validators.required, Validators.min(100)]],
      payoutMethod: [PayoutMethod.BankTransfer, Validators.required],
      bankName: [''],
      accountHolderName: [''],
      bankAccountNumber: [''],
      bankIBAN: [''],
      walletProvider: [''],
      walletNumber: [''],
    });

    this.form.get('payoutMethod')!.valueChanges.subscribe(() => this.toggleValidators());
  }

  private regenerateKey(): void {
    this.idempotencyKey = crypto.randomUUID();
  }

  private toggleValidators(): void {
    const isBank = this.form.get('payoutMethod')!.value === PayoutMethod.BankTransfer;
    const fieldKeys: string[] = [
      'bankName',
      'accountHolderName',
      'bankAccountNumber',
      'bankIBAN',
      'walletProvider',
      'walletNumber',
    ];
    const requiredKeys: string[] = isBank
      ? ['bankName', 'accountHolderName', 'bankAccountNumber', 'bankIBAN']
      : ['walletProvider', 'walletNumber'];

    for (const key of fieldKeys) {
      const control = this.form.get(key)!;
      if (requiredKeys.includes(key)) {
        control.setValidators([Validators.required]);
      } else {
        control.clearValidators();
      }
      control.updateValueAndValidity();
    }
  }

  get showBankFields(): boolean {
    return this.form.get('payoutMethod')!.value === PayoutMethod.BankTransfer;
  }

  get showWalletFields(): boolean {
    return !this.showBankFields;
  }

  get payoutOptions(): { value: PayoutMethod; label: string; icon: string }[] {
    return [
      { value: PayoutMethod.BankTransfer, label: PayoutMethodLabel[PayoutMethod.BankTransfer], icon: 'bi bi-bank' },
      { value: PayoutMethod.MobileWallet, label: PayoutMethodLabel[PayoutMethod.MobileWallet], icon: 'bi bi-phone' },
    ];
  }

  onSubmit(): void {
    this.error = '';
    this.successMessage = '';

    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.submitting = true;
    this.walletService.createWithdrawal(this.form.value, this.idempotencyKey).subscribe({
      next: () => {
        this.submitting = false;
        this.successMessage = 'تم إرسال طلب السحب بنجاح وسيتم مراجعته خلال 24 ساعة.';
        this.form.reset({ payoutMethod: PayoutMethod.BankTransfer });
        this.toggleValidators();
        this.regenerateKey();
      },
      error: (err) => {
        this.submitting = false;
        const detail = err?.error?.message ?? err?.error?.title;
        this.error = detail || 'تعذر إرسال طلب السحب. حاول مرة أخرى.';
      },
    });
  }
}
