import type { Scenario, SimStep, Station } from '../../types/simulation'

const steps: SimStep[] = [
  {
    id: 1,
    phase: 'plan',
    title: 'Compaction strategy checks SSTable counts and sizes',
    fn: 'CompactionManager.instance.submitBackground()',
    file: 'org/apache/cassandra/db/compaction/CompactionManager.java',
    description:
      'Completely independent of any client request, Cassandra periodically checks whether a table has accumulated enough small SSTable files that merging them would help. This is a background maintenance process — nobody asked for this to happen right now, it just does.',
    activeNode: 'sstable',
    xp: 10,
  },
  {
    id: 2,
    phase: 'plan',
    title: 'Four similarly-sized SSTables are selected as a bucket',
    fn: 'SizeTieredCompactionStrategy.getSSTablesForCompaction()',
    file: 'org/apache/cassandra/db/compaction/SizeTieredCompactionStrategy.java',
    description:
      'Under the default Size-Tiered Compaction Strategy, Cassandra groups files of roughly equal size together to merge. (A read-heavy table might instead use Leveled Compaction Strategy, which organizes files into size-bounded levels for more predictable read performance — a different trade-off, not simulated here.)',
    activeNode: 'sstable',
    xp: 10,
  },
  {
    id: 3,
    phase: 'plan',
    title: 'A compaction task is registered; inputs stay fully readable',
    fn: 'LifecycleTransaction  // marks sstables as compacting',
    file: 'org/apache/cassandra/db/lifecycle/LifecycleTransaction.java',
    description:
      'Cassandra marks these four files as "currently compacting" purely to stop anything else from deleting them mid-operation. Any query running right now can still read them completely normally — compaction never blocks reads.',
    activeNode: 'sstable',
    xp: 10,
  },
  {
    id: 4,
    phase: 'scan',
    title: 'A merged iterator opens across all four SSTables, sorted by key',
    fn: 'CompactionIterator',
    file: 'org/apache/cassandra/db/compaction/CompactionIterator.java',
    description:
      'Since every SSTable is already internally sorted by partition key, Cassandra walks all four in lockstep — like merging four sorted stacks of index cards into one, without re-sorting anything from scratch.',
    activeNode: 'sstable',
    xp: 15,
  },
  {
    id: 5,
    phase: 'scan',
    title: 'Fragments of the same partition are merged by timestamp',
    fn: 'UnfilteredRowIterators.merge()',
    file: 'org/apache/cassandra/db/rows/UnfilteredRowIterators.java',
    description:
      'The exact same merge-by-timestamp logic used to answer a read is used here too — except instead of returning the merged result to a client, compaction writes it into a new file.',
    activeNode: 'sstable',
    xp: 10,
  },
  {
    id: 6,
    phase: 'execute',
    title: 'An older, superseded column version is dropped',
    fn: '(part of the merge — the older cell simply is not written to the output)',
    file: 'org/apache/cassandra/db/compaction/CompactionIterator.java',
    description:
      'This is how Cassandra actually reclaims space from every earlier write and update you have traced: whichever version is oldest, once a newer one exists for the same cell, just does not get copied into the new file at all. It was never explicitly deleted — it simply is not carried forward.',
    activeNode: 'sstable',
    xp: 15,
  },
  {
    id: 7,
    phase: 'execute',
    title: 'A tombstone is found; Cassandra checks its grace period',
    fn: 'localDeletionTime + gc_grace_seconds  vs.  now',
    file: 'org/apache/cassandra/db/compaction/CompactionIterator.java',
    description:
      'For every tombstone encountered, Cassandra checks whether enough time has passed since the delete for every replica to have safely received it — the same gc_grace_seconds window from the delete path.',
    activeNode: 'sstable',
    xp: 10,
  },
  {
    id: 8,
    phase: 'execute',
    title: 'Grace period elapsed: the tombstone is purged forever',
    fn: 'CompactionIterator  // tombstone and shadowed data both dropped',
    file: 'org/apache/cassandra/db/compaction/CompactionIterator.java',
    description:
      'For this particular tombstone, enough time has passed. Both the tombstone marker and the row data it was shadowing are now dropped completely — neither is written into the new SSTable. This is the moment a deleted row actually, finally disappears from Cassandra for good.',
    activeNode: 'sstable',
    xp: 25,
    insight: 'tombstone_purge',
  },
  {
    id: 9,
    phase: 'execute',
    title: "A different tombstone, still within grace period, is carried forward",
    fn: 'CompactionIterator  // tombstone written through, unpurged',
    file: 'org/apache/cassandra/db/compaction/CompactionIterator.java',
    description:
      "A more recent delete on a different row has not yet crossed its grace period, so its tombstone is copied into the new SSTable unchanged — still doing its job of shadowing older data until it, too, is safe to remove.",
    activeNode: 'sstable',
    xp: 10,
  },
  {
    id: 10,
    phase: 'heap',
    title: 'Surviving rows are written into a brand-new SSTable',
    fn: 'SSTableWriter.append()',
    file: 'org/apache/cassandra/io/sstable/format/SSTableWriter.java',
    description:
      'Everything that survived the merge — the latest version of every cell, plus any tombstone still within its grace period — is written out as one new, permanent file.',
    activeNode: 'sstable',
    xp: 10,
  },
  {
    id: 11,
    phase: 'heap',
    title: 'Fresh index and bloom filter are built for the survivors',
    fn: 'SSTableWriter.openFinal()',
    file: 'org/apache/cassandra/io/sstable/format/SSTableWriter.java',
    description:
      'Because dropped versions and purged tombstones mean fewer keys than the four old files combined, this new bloom filter and index are smaller and faster to check than the four they are about to replace.',
    activeNode: 'sstable',
    xp: 10,
  },
  {
    id: 12,
    phase: 'commit',
    title: 'New SSTable is finalized and made visible to reads',
    fn: 'LifecycleTransaction.finish()',
    file: 'org/apache/cassandra/db/lifecycle/LifecycleTransaction.java',
    description: 'The merged file is now a first-class SSTable — any read arriving from this point on will use it.',
    activeNode: 'sstable',
    xp: 10,
  },
  {
    id: 13,
    phase: 'commit',
    title: 'Old input SSTables are marked obsolete',
    fn: 'LifecycleTransaction.obsoleteOriginals()',
    file: 'org/apache/cassandra/db/lifecycle/LifecycleTransaction.java',
    description: 'The four original files are no longer needed by anything — every future read will use the one new merged file instead.',
    activeNode: 'sstable',
    xp: 10,
  },
  {
    id: 14,
    phase: 'commit',
    title: 'Old SSTable files are physically deleted from disk',
    fn: 'LogTransaction  // deletes obsoleted sstable files',
    file: 'org/apache/cassandra/db/lifecycle/LogTransaction.java',
    description:
      'Disk space is reclaimed, and this partition range now only needs one bloom filter and one file checked on a future read, instead of four — read latency for this table just got a little better.',
    activeNode: 'sstable',
    xp: 15,
  },
  {
    id: 15,
    phase: 'commit',
    title: 'Compaction task completes; table returns to steady state',
    fn: 'CompactionTask.runMayThrow()  // completes',
    file: 'org/apache/cassandra/db/compaction/CompactionTask.java',
    description:
      'Nothing more happens until enough new SSTables pile up again to trigger the next round. This whole cycle — write, flush, accumulate, compact — repeats for as long as the table exists.',
    activeNode: 'sstable',
    xp: 10,
  },
]

const stations: Station[] = [
  { phase: 'plan', title: 'Select SSTables', range: [1, 3] },
  { phase: 'scan', title: 'Merge by Key & Timestamp', range: [4, 5] },
  { phase: 'execute', title: 'Drop Old Versions & Tombstones', range: [6, 9] },
  { phase: 'heap', title: 'Write New SSTable', range: [10, 11] },
  { phase: 'commit', title: 'Finalize & Reclaim Space', range: [12, 15] },
]

export const cassandraCompactionScenario: Scenario = {
  id: 'cassandra_compaction',
  toolId: 'cassandra',
  tabLabel: 'COMPACTION',
  title: 'Background compaction — merging SSTables',
  subtitle:
    'A background maintenance cycle: four SSTables merged into one, stale column versions dropped, and an expired tombstone purged forever — traced against real Apache Cassandra source (approx. v4.x).',
  steps,
  stations,
  criticalPathEnd: 15,
  totalXp: steps.reduce((sum, s) => sum + s.xp, 0),
}
