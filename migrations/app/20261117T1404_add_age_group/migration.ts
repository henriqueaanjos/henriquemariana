#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/1f50517a7e7b3b3b34a0f8a43bab89e36d94d2de1e962333ab801943196e003f/contract';
import endContract from '../../snapshots/1f50517a7e7b3b3b34a0f8a43bab89e36d94d2de1e962333ab801943196e003f/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/2afd8c2256614a4e6166458a7e6a4074cf5963d4d58d7f5ba2a1e29696e7b483/contract';
import startContract from '../../snapshots/2afd8c2256614a4e6166458a7e6a4074cf5963d4d58d7f5ba2a1e29696e7b483/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'FamilyMember',
        column: col('ageGroup', 'text', {
          notNull: true,
          default: lit('ADULT'),
          codecRef: { codecId: 'pg/text@1' },
        }),
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'FamilyMember',
        constraint: 'FamilyMember_ageGroup_check_46502c7d',
        expression: "\"ageGroup\" IN ('ADULT', 'CHILD_4_7', 'CHILD_UNDER_4')",
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
