import test from 'node:test';
import assert from 'node:assert/strict';
import './simplification-engine.js';

const engine = (globalThis as unknown as { RRBClerkSimplificationEngine: any }).RRBClerkSimplificationEngine;

test('generateSingleQuestion creates valid 4-option MCQ for Easy, Moderate, and Hard RRB Clerk tiers', () => {
  for (const tier of ['easy', 'moderate', 'hard']) {
    for (let i = 0; i < 40; i++) {
      const q = engine.generateSingleQuestion(tier);
      assert.equal(q.difficulty, tier);
      assert.equal(Number.isInteger(q.answer), true, `Answer must be integer, got ${q.answer}`);
      assert.equal(q.answer > 0, true, `Answer must be positive, got ${q.answer}`);
      assert.equal(Array.isArray(q.options), true);
      assert.equal(q.options.length, 4, 'Must have exactly 4 options');
      const uniqueOpts = new Set(q.options);
      assert.equal(uniqueOpts.size, 4, `Options must be 4 distinct integers: ${q.options}`);
      assert.equal(q.options[q.correctIndex], q.answer, 'correctIndex must point to exact answer');
      assert.equal(q.aiAnalysis.isClerkCompliant, true);
      assert.equal(q.aiAnalysis.poLevelBlocked, true);
      assert.equal(q.aiAnalysis.complexityScore <= 92, true);
    }
  }
});

test('complexity scores are properly calibrated across Easy, Moderate, and Hard RRB Clerk tiers', () => {
  const easyQ = engine.generateSingleQuestion('easy');
  const modQ = engine.generateSingleQuestion('moderate');
  const hardQ = engine.generateSingleQuestion('hard');

  assert.equal(easyQ.aiAnalysis.complexityScore <= 42, true);
  assert.equal(modQ.aiAnalysis.complexityScore >= 45 && modQ.aiAnalysis.complexityScore <= 72, true);
  assert.equal(hardQ.aiAnalysis.complexityScore >= 74 && hardQ.aiAnalysis.complexityScore <= 92, true);
});

test('generateQuestionSet supports easy, moderate, hard, and exam_mix modes', () => {
  const mixSet = engine.generateQuestionSet('exam_mix', 15);
  assert.equal(mixSet.length, 15);
  const tiers = new Set(mixSet.map((q: { difficulty: string }) => q.difficulty));
  assert.equal(tiers.has('easy'), true);
  assert.equal(tiers.has('moderate'), true);
  assert.equal(tiers.has('hard'), true);
});

test('getNextAdaptiveDifficulty promotes and demotes within RRB Clerk bounds', () => {
  const promoted = engine.getNextAdaptiveDifficulty(
    [
      { status: 'correct', timeTakenSec: 12, targetSeconds: 16 },
      { status: 'correct', timeTakenSec: 14, targetSeconds: 16 }
    ],
    'easy'
  );
  assert.equal(promoted, 'moderate');

  const demoted = engine.getNextAdaptiveDifficulty(
    [
      { status: 'wrong', timeTakenSec: 30, targetSeconds: 25 },
      { status: 'skipped', timeTakenSec: 8, targetSeconds: 25 }
    ],
    'hard'
  );
  assert.equal(demoted, 'moderate');
});
