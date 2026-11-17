#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/2afd8c2256614a4e6166458a7e6a4074cf5963d4d58d7f5ba2a1e29696e7b483/contract';
import endContract from '../../snapshots/2afd8c2256614a4e6166458a7e6a4074cf5963d4d58d7f5ba2a1e29696e7b483/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/6dc27314663f8c2af081974357b7359efc7df53878f15383a879fa97501e4acd/contract';
import startContract from '../../snapshots/6dc27314663f8c2af081974357b7359efc7df53878f15383a879fa97501e4acd/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [this.dropDefault({ schema: 'public', table: 'FamilyMember', column: 'checkedInAt' })];
  }
}

MigrationCLI.run(import.meta.url, M);
