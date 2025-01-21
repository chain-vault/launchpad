import { PublicKey } from '@solana/web3.js';

export function deriveEscrow(base: PublicKey, programId: PublicKey) {
  return PublicKey.findProgramAddressSync([Buffer.from('escrow'), base.toBuffer()], programId);
}

export function deriveEscrowMetadata(escrow: PublicKey, programId: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('escrow_metadata'), escrow.toBuffer()],
    programId
  );
}
