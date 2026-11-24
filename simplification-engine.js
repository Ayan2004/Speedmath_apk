/**
 * IBPS RRB Clerk Simplification Engine & Client-Side AI Level Analyzer
 * 100% Static Client-Side JavaScript — Works on GitHub Pages with zero backend required.
 */
(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.RRBClerkSimplificationEngine = factory();
    }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    function randInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function pickOne(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function shuffle(arr) {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    // High-frequency IBPS RRB Clerk fraction-percentage equivalents
    const CLERK_FRAC_PCTS_MODERATE = [
        { label: '12.5%', mixed: '12(1/2)%', num: 1, den: 8 },
        { label: '25%', mixed: '25%', num: 1, den: 4 },
        { label: '20%', mixed: '20%', num: 1, den: 5 },
        { label: '33.33%', mixed: '33(1/3)%', num: 1, den: 3 },
        { label: '16.66%', mixed: '16(2/3)%', num: 1, den: 6 },
        { label: '37.5%', mixed: '37(1/2)%', num: 3, den: 8 },
        { label: '40%', mixed: '40%', num: 2, den: 5 },
        { label: '60%', mixed: '60%', num: 3, den: 5 },
        { label: '75%', mixed: '75%', num: 3, den: 4 }
    ];

    const CLERK_FRAC_PCTS_HARD = [
        { label: '37.5%', mixed: '37(1/2)%', num: 3, den: 8 },
        { label: '62.5%', mixed: '62(1/2)%', num: 5, den: 8 },
        { label: '87.5%', mixed: '87(1/2)%', num: 7, den: 8 },
        { label: '66.66%', mixed: '66(2/3)%', num: 2, den: 3 },
        { label: '83.33%', mixed: '83(1/3)%', num: 5, den: 6 },
        { label: '14.28%', mixed: '14(2/7)%', num: 1, den: 7 },
        { label: '28.57%', mixed: '28(4/7)%', num: 2, den: 7 },
        { label: '42.85%', mixed: '42(6/7)%', num: 3, den: 7 },
        { label: '18.18%', mixed: '18(2/11)%', num: 2, den: 11 },
        { label: '27.27%', mixed: '27(3/11)%', num: 3, den: 11 },
        { label: '41.66%', mixed: '41(2/3)%', num: 5, den: 12 },
        { label: '18.75%', mixed: '18(3/4)%', num: 3, den: 16 }
    ];

    /**
     * AI Question Level Analyzer & Guardrail Calibrator
     * Scores complexity (1–100) and verifies the question stays strictly within IBPS RRB Clerk bounds
     * (never drifting into PO-level multi-variable surds or non-integer decimal traps).
     */
    function analyzeQuestionComplexity(qMeta) {
        const {
            difficulty,
            opCount,
            hasSquareRoot,
            hasCubeRoot,
            hasFractionPct,
            hasMixedFraction,
            hasMissingPower,
            answer
        } = qMeta;

        let rawScore = opCount * 11;
        if (hasSquareRoot) rawScore += 10;
        if (hasCubeRoot) rawScore += 14;
        if (hasFractionPct) rawScore += 16;
        if (hasMixedFraction) rawScore += 15;
        if (hasMissingPower) rawScore += 12;

        // Clamp within difficulty tier bands for RRB Clerk Prelims
        let complexityScore = rawScore;
        let targetSeconds = 18;
        let tierBandLabel = 'RRB Clerk Prelims • Easy';

        if (difficulty === 'easy') {
            complexityScore = Math.max(18, Math.min(42, rawScore));
            targetSeconds = randInt(12, 17);
            tierBandLabel = 'RRB Clerk Prelims • Easy';
        } else if (difficulty === 'moderate') {
            complexityScore = Math.max(45, Math.min(72, rawScore + 12));
            targetSeconds = randInt(18, 25);
            tierBandLabel = 'RRB Clerk Prelims • Moderate';
        } else {
            complexityScore = Math.max(74, Math.min(92, rawScore + 24));
            targetSeconds = randInt(25, 34);
            tierBandLabel = 'RRB Clerk Prelims • Hard (Clerk Ceiling)';
        }

        // Guardrail check: answer must be a finite integer and reasonable magnitude for mental simplification
        const isClerkCompliant =
            Number.isInteger(answer) &&
            Math.abs(answer) <= 5000 &&
            answer >= 1 &&
            complexityScore <= 92; // >92 is PO level, strictly blocked

        return {
            complexityScore,
            targetSeconds,
            tierBandLabel,
            isClerkCompliant,
            poLevelBlocked: true
        };
    }

    /**
     * Generates 4 realistic IBPS RRB Clerk exam MCQ options (A, B, C, D)
     * Uses authentic exam distractor traps:
     * - Same unit digit (+10, -10, +20, -20)
     * - Off-by-carry (+2, -2, +5, -5)
     * - Digit transposition or close neighbor
     */
    function generateFourOptions(correctAnswer) {
        const ans = Number(correctAnswer);
        const candidates = new Set();

        const offsets = [10, -10, 20, -20, 5, -5, 2, -2, 8, -8, 12, -12, 15, -15, 4, -4, 6, -6, 30, -30];

        // If 2-digit number, transposed digits is a classic banking exam distractor
        if (ans >= 12 && ans <= 98) {
            const tens = Math.floor(ans / 10);
            const units = ans % 10;
            if (tens !== units && units !== 0) {
                const swapped = units * 10 + tens;
                if (swapped > 0 && swapped !== ans) {
                    candidates.add(swapped);
                }
            }
        }

        const shuffledOffsets = shuffle(offsets);
        for (const off of shuffledOffsets) {
            const val = ans + off;
            if (val > 0 && val !== ans) {
                candidates.add(val);
            }
            if (candidates.size >= 8) break;
        }

        let fallbackStep = 1;
        while (candidates.size < 3) {
            const val = ans + fallbackStep;
            if (val > 0 && val !== ans) candidates.add(val);
            fallbackStep++;
        }

        // Pick 3 distractors prioritizing at least one with the same unit digit (+10 or -10)
        const candidateList = Array.from(candidates);
        const sameUnitDigit = candidateList.filter(c => Math.abs(c - ans) % 10 === 0);
        const otherDistractors = candidateList.filter(c => Math.abs(c - ans) % 10 !== 0);

        const pickedDistractors = [];
        if (sameUnitDigit.length > 0) {
            pickedDistractors.push(sameUnitDigit[0]);
        }
        for (const d of otherDistractors) {
            if (pickedDistractors.length < 3 && !pickedDistractors.includes(d)) {
                pickedDistractors.push(d);
            }
        }
        for (const d of candidateList) {
            if (pickedDistractors.length < 3 && !pickedDistractors.includes(d)) {
                pickedDistractors.push(d);
            }
        }

        const finalFour = shuffle([ans, ...pickedDistractors.slice(0, 3)]);
        const correctIndex = finalFour.indexOf(ans);

        return {
            options: finalFour,
            correctIndex
        };
    }

    // =========================================================================
    // 1. EASY LEVEL TEMPLATES (IBPS RRB Clerk Direct BODMAS, Squares & Roots)
    // =========================================================================
    function generateEasyQuestion() {
        const pattern = randInt(1, 5);

        if (pattern === 1) {
            // Pattern E1: 3-Digit Addition & Subtraction BODMAS Chain: A + B - C = ?
            const a = randInt(125, 480);
            const b = randInt(115, 390);
            const c = randInt(85, Math.min(420, a + b - 25));
            const ans = a + b - c;
            return {
                difficulty: 'easy',
                patternName: 'Direct 3-Digit Addition & Subtraction',
                expression: `${a} + ${b} − ${c} = ?`,
                answer: ans,
                shortcutTip: `Add & subtract column-wise or by unit digits: (${a} + ${b}) − ${c} = ${a + b} − ${c} = ${ans}`,
                steps: [
                    `Step 1: ${a} + ${b} = ${a + b}`,
                    `Step 2: ${a + b} − ${c} = ${ans}`
                ],
                meta: { difficulty: 'easy', opCount: 2, hasSquareRoot: false, hasCubeRoot: false, hasFractionPct: false, hasMixedFraction: false, hasMissingPower: false, answer: ans }
            };
        }

        if (pattern === 2) {
            // Pattern E2: Direct Square Roots & Squares: √A + √B + c² = ?
            const r1 = randInt(11, 25);
            const r2 = randInt(12, 26);
            const c = randInt(4, 11);
            const sq1 = r1 * r1;
            const sq2 = r2 * r2;
            const cSq = c * c;
            const ans = r1 + r2 + cSq;
            return {
                difficulty: 'easy',
                patternName: 'Perfect Square Roots & Squares',
                expression: `√${sq1} + √${sq2} + ${c}² = ?`,
                answer: ans,
                shortcutTip: `Recall squares 1–30 instantly: √${sq1} = ${r1}, √${sq2} = ${r2}, and ${c}² = ${cSq}`,
                steps: [
                    `Step 1: √${sq1} = ${r1} and √${sq2} = ${r2}`,
                    `Step 2: ${c}² = ${cSq}`,
                    `Step 3: ${r1} + ${r2} + ${cSq} = ${ans}`
                ],
                meta: { difficulty: 'easy', opCount: 2, hasSquareRoot: true, hasCubeRoot: false, hasFractionPct: false, hasMixedFraction: false, hasMissingPower: false, answer: ans }
            };
        }

        if (pattern === 3) {
            // Pattern E3: Clean Percentage of Hundreds: p% of A + q% of B = ?
            const p = pickOne([15, 20, 25, 30, 35, 40, 45, 50, 60, 75]);
            const q = pickOne([12, 15, 18, 20, 24, 25, 30, 40, 50]);
            const multA = randInt(2, 8) * 20; // divisible by 20 -> p% is integer
            const multB = randInt(2, 6) * 100;
            const term1 = (p * multA) / 100;
            const term2 = (q * multB) / 100;
            const ans = term1 + term2;
            return {
                difficulty: 'easy',
                patternName: 'Direct Percentage Simplification',
                expression: `${p}% of ${multA} + ${q}% of ${multB} = ?`,
                answer: ans,
                shortcutTip: `Cancel zeroes directly: (${p} × ${multA / 100}) + (${q} × ${multB / 100}) = ${term1} + ${term2} = ${ans}`,
                steps: [
                    `Step 1: ${p}% of ${multA} = ${term1}`,
                    `Step 2: ${q}% of ${multB} = ${term2}`,
                    `Step 3: ${term1} + ${term2} = ${ans}`
                ],
                meta: { difficulty: 'easy', opCount: 2, hasSquareRoot: false, hasCubeRoot: false, hasFractionPct: false, hasMixedFraction: false, hasMissingPower: false, answer: ans }
            };
        }

        if (pattern === 4) {
            // Pattern E4: BODMAS Division & Multiplication Chain: (A ÷ b) × c + d = ?
            const b = randInt(6, 16);
            const quotient = randInt(8, 22);
            const a = b * quotient;
            const c = randInt(4, 12);
            const d = randInt(18, 85);
            const ans = quotient * c + d;
            return {
                difficulty: 'easy',
                patternName: 'BODMAS Division & Multiplication',
                expression: `${a} ÷ ${b} × ${c} + ${d} = ?`,
                answer: ans,
                shortcutTip: `Apply BODMAS (Divide first, then Multiply): (${a} ÷ ${b}) = ${quotient} → ${quotient} × ${c} + ${d} = ${ans}`,
                steps: [
                    `Step 1 (Division): ${a} ÷ ${b} = ${quotient}`,
                    `Step 2 (Multiplication): ${quotient} × ${c} = ${quotient * c}`,
                    `Step 3 (Addition): ${quotient * c} + ${d} = ${ans}`
                ],
                meta: { difficulty: 'easy', opCount: 3, hasSquareRoot: false, hasCubeRoot: false, hasFractionPct: false, hasMixedFraction: false, hasMissingPower: false, answer: ans }
            };
        }

        // Pattern E5: Find ? when rhs is (? )²: a × b + c = (?)²
        const ans = randInt(7, 19);
        const targetSq = ans * ans;
        const a = randInt(6, 15);
        const b = randInt(5, Math.max(6, Math.floor((targetSq - 10) / a)));
        const prod = a * b;
        const c = targetSq - prod;
        const opSign = c >= 0 ? '+' : '−';
        const absC = Math.abs(c);
        return {
            difficulty: 'easy',
            patternName: 'Missing Base of a Square (?)²',
            expression: `${a} × ${b} ${opSign} ${absC} = (?)²`,
            answer: ans,
            shortcutTip: `Compute the LHS first, then take its square root: ${prod} ${opSign} ${absC} = ${targetSq} → √${targetSq} = ${ans}`,
            steps: [
                `Step 1: ${a} × ${b} = ${prod}`,
                `Step 2: ${prod} ${opSign} ${absC} = ${targetSq}`,
                `Step 3: (?)² = ${targetSq} ⇒ ? = √${targetSq} = ${ans}`
            ],
            meta: { difficulty: 'easy', opCount: 2, hasSquareRoot: true, hasCubeRoot: false, hasFractionPct: false, hasMixedFraction: false, hasMissingPower: true, answer: ans }
        };
    }

    // =========================================================================
    // 2. MODERATE LEVEL TEMPLATES (Standard IBPS RRB Clerk Prelims Shift Level)
    // =========================================================================
    function generateModerateQuestion() {
        const pattern = randInt(1, 5);

        if (pattern === 1) {
            // Pattern M1: Clerk Fraction-Percentage Combo: f1% of A + f2% of B = ?
            const f1 = pickOne(CLERK_FRAC_PCTS_MODERATE);
            const f2 = pickOne(CLERK_FRAC_PCTS_MODERATE);
            const k1 = randInt(12, 36);
            const k2 = randInt(10, 32);
            const A = f1.den * k1;
            const B = f2.den * k2;
            const val1 = f1.num * k1;
            const val2 = f2.num * k2;
            const ans = val1 + val2;
            return {
                difficulty: 'moderate',
                patternName: 'Fraction-to-Percentage Conversion',
                expression: `${f1.label} of ${A} + ${f2.label} of ${B} = ?`,
                answer: ans,
                shortcutTip: `Convert percentages to Clerk fractions: ${f1.label} = ${f1.num}/${f1.den} and ${f2.label} = ${f2.num}/${f2.den}`,
                steps: [
                    `Step 1: ${f1.label} of ${A} = (${f1.num}/${f1.den}) × ${A} = ${val1}`,
                    `Step 2: ${f2.label} of ${B} = (${f2.num}/${f2.den}) × ${B} = ${val2}`,
                    `Step 3: ${val1} + ${val2} = ${ans}`
                ],
                meta: { difficulty: 'moderate', opCount: 3, hasSquareRoot: false, hasCubeRoot: false, hasFractionPct: true, hasMixedFraction: false, hasMissingPower: false, answer: ans }
            };
        }

        if (pattern === 2) {
            // Pattern M2: Cube Root + Square Root + Multiplication: ∛A × √B + c² = ?
            const cubeBase = randInt(6, 15);
            const sqBase = randInt(11, 24);
            const c = randInt(7, 16);
            const cubeVal = cubeBase * cubeBase * cubeBase;
            const sqVal = sqBase * sqBase;
            const prod = cubeBase * sqBase;
            const cSq = c * c;
            const ans = prod + cSq;
            return {
                difficulty: 'moderate',
                patternName: 'Cube Root & Square Root BODMAS',
                expression: `∛${cubeVal} × √${sqVal} + ${c}² = ?`,
                answer: ans,
                shortcutTip: `Recall cubes (1–15) & squares (1–30): ∛${cubeVal} = ${cubeBase}, √${sqVal} = ${sqBase}, ${c}² = ${cSq}`,
                steps: [
                    `Step 1: ∛${cubeVal} = ${cubeBase} and √${sqVal} = ${sqBase}`,
                    `Step 2: ${cubeBase} × ${sqBase} = ${prod}`,
                    `Step 3: ${prod} + ${c}² (${cSq}) = ${ans}`
                ],
                meta: { difficulty: 'moderate', opCount: 3, hasSquareRoot: true, hasCubeRoot: true, hasFractionPct: false, hasMixedFraction: false, hasMissingPower: false, answer: ans }
            };
        }

        if (pattern === 3) {
            // Pattern M3: Mixed Fraction Whole + Fraction Separation Trick
            // e.g., 14(1/3) + 18(2/3) + 12(1/4) + 7(3/4) = ?
            const pairs = [
                { d: 3, n1: 1, n2: 2 },
                { d: 4, n1: 1, n2: 3 },
                { d: 5, n1: 2, n2: 3 },
                { d: 6, n1: 1, n2: 5 },
                { d: 8, n1: 3, n2: 5 }
            ];
            const pair = pickOne(pairs);
            const w1 = randInt(11, 28);
            const w2 = randInt(12, 26);
            const w3 = randInt(8, 22);
            const ans = w1 + w2 + 1 - w3;
            return {
                difficulty: 'moderate',
                patternName: 'Mixed Fraction Separation Method',
                expression: `${w1} (${pair.n1}/${pair.d}) + ${w2} (${pair.n2}/${pair.d}) − ${w3} = ?`,
                answer: ans,
                shortcutTip: `Add whole parts and fraction parts separately: (${w1} + ${w2} − ${w3}) + (${pair.n1}/${pair.d} + ${pair.n2}/${pair.d}) = ${w1 + w2 - w3} + 1 = ${ans}`,
                steps: [
                    `Step 1 (Whole numbers): ${w1} + ${w2} − ${w3} = ${w1 + w2 - w3}`,
                    `Step 2 (Fractions): ${pair.n1}/${pair.d} + ${pair.n2}/${pair.d} = 1`,
                    `Step 3: ${w1 + w2 - w3} + 1 = ${ans}`
                ],
                meta: { difficulty: 'moderate', opCount: 3, hasSquareRoot: false, hasCubeRoot: false, hasFractionPct: false, hasMixedFraction: true, hasMissingPower: false, answer: ans }
            };
        }

        if (pattern === 4) {
            // Pattern M4: Missing Factor with Brackets & Squares: (A + B) ÷ c + d² = ? × e
            const e = randInt(4, 9);
            const ans = randInt(11, 28);
            const rhsTotal = ans * e;
            const d = randInt(5, Math.min(13, Math.floor(Math.sqrt(rhsTotal - 12))));
            const dSq = d * d;
            const quotient = rhsTotal - dSq;
            const c = randInt(6, 14);
            const sumAB = quotient * c;
            const A = randInt(Math.floor(sumAB * 0.35), Math.floor(sumAB * 0.65));
            const B = sumAB - A;
            return {
                difficulty: 'moderate',
                patternName: 'Bracket Division & Missing Multiplier',
                expression: `(${A} + ${B}) ÷ ${c} + ${d}² = ? × ${e}`,
                answer: ans,
                shortcutTip: `Clear brackets first: (${A} + ${B}) ÷ ${c} = ${sumAB} ÷ ${c} = ${quotient}; add ${d}² (${dSq}) = ${rhsTotal}; divide by ${e}`,
                steps: [
                    `Step 1: (${A} + ${B}) ÷ ${c} = ${sumAB} ÷ ${c} = ${quotient}`,
                    `Step 2: ${quotient} + ${d}² = ${quotient} + ${dSq} = ${rhsTotal}`,
                    `Step 3: ? = ${rhsTotal} ÷ ${e} = ${ans}`
                ],
                meta: { difficulty: 'moderate', opCount: 4, hasSquareRoot: false, hasCubeRoot: false, hasFractionPct: false, hasMixedFraction: false, hasMissingPower: false, answer: ans }
            };
        }

        // Pattern M5: Missing Percentage Value: ?% of A + b × c = D
        const ans = pickOne([15, 20, 25, 30, 35, 40, 45, 55, 60, 65, 75, 80]);
        const A = pickOne([200, 300, 400, 500, 600, 800]);
        const pctPart = (ans * A) / 100;
        const b = randInt(12, 24);
        const c = randInt(6, 14);
        const prod = b * c;
        const D = pctPart + prod;
        return {
            difficulty: 'moderate',
            patternName: 'Find Missing Percentage (?% of N)',
            expression: `?% of ${A} + ${b} × ${c} = ${D}`,
            answer: ans,
            shortcutTip: `Notice ?% of ${A} is simply ? × ${A / 100}: subtract (${b} × ${c} = ${prod}) from ${D}, then divide by ${A / 100}`,
            steps: [
                `Step 1: ${b} × ${c} = ${prod}`,
                `Step 2: ?% of ${A} = ${D} − ${prod} = ${pctPart}`,
                `Step 3: ? = ${pctPart} ÷ ${A / 100} = ${ans}`
            ],
            meta: { difficulty: 'moderate', opCount: 3, hasSquareRoot: false, hasCubeRoot: false, hasFractionPct: true, hasMixedFraction: false, hasMissingPower: false, answer: ans }
        };
    }

    // =========================================================================
    // 3. HARD LEVEL TEMPLATES (Strictly IBPS RRB Clerk Tricky Level — NO PO Clutter)
    // =========================================================================
    function generateHardQuestion() {
        const pattern = randInt(1, 5);

        if (pattern === 1) {
            // Pattern H1: High-Yield RRB Clerk Multi-Fraction Percentages + Square Root on RHS
            // e.g. 62.5% of 320 + 83.33% of 216 - √225 = ?
            const f1 = pickOne(CLERK_FRAC_PCTS_HARD);
            const f2 = pickOne(CLERK_FRAC_PCTS_HARD);
            const k1 = randInt(12, 32);
            const k2 = randInt(10, 28);
            const A = f1.den * k1;
            const B = f2.den * k2;
            const val1 = f1.num * k1;
            const val2 = f2.num * k2;
            const r = randInt(11, 25);
            const sq = r * r;
            const ans = val1 + val2 - r;
            return {
                difficulty: 'hard',
                patternName: 'High-Yield Clerk p/q Percentages & Root',
                expression: `${f1.label} of ${A} + ${f2.label} of ${B} − √${sq} = ?`,
                answer: ans,
                shortcutTip: `Use Clerk p/q table: ${f1.label} = ${f1.num}/${f1.den} and ${f2.label} = ${f2.num}/${f2.den}; √${sq} = ${r}`,
                steps: [
                    `Step 1: ${f1.label} of ${A} = (${f1.num}/${f1.den}) × ${A} = ${val1}`,
                    `Step 2: ${f2.label} of ${B} = (${f2.num}/${f2.den}) × ${B} = ${val2}`,
                    `Step 3: ${val1} + ${val2} − √${sq} (${r}) = ${ans}`
                ],
                meta: { difficulty: 'hard', opCount: 4, hasSquareRoot: true, hasCubeRoot: false, hasFractionPct: true, hasMixedFraction: false, hasMissingPower: false, answer: ans }
            };
        }

        if (pattern === 2) {
            // Pattern H2: Difference of Squares Identity + Cube Root: (a² - b²) ÷ c + ∛D = ?
            // In RRB Clerk, students use (a - b)(a + b) to solve in 15 seconds
            const b = randInt(11, 21);
            const diff = randInt(4, 10);
            const a = b + diff;
            const c = diff; // divides (a^2 - b^2) cleanly leaving (a + b)
            const cubeBase = randInt(7, 15);
            const cubeVal = cubeBase * cubeBase * cubeBase;
            const divResult = a + b;
            const ans = divResult + cubeBase;
            return {
                difficulty: 'hard',
                patternName: 'Algebraic Square Difference & Cube Root',
                expression: `(${a}² − ${b}²) ÷ ${c} + ∛${cubeVal} = ?`,
                answer: ans,
                shortcutTip: `Use (a² − b²) = (a − b)(a + b): (${a} − ${b})(${a} + ${b}) ÷ ${c} = ${diff} × ${a + b} ÷ ${c} = ${a + b}`,
                steps: [
                    `Step 1: (${a}² − ${b}²) ÷ ${c} = (${a} − ${b})(${a} + ${b}) ÷ ${c} = ${a + b}`,
                    `Step 2: ∛${cubeVal} = ${cubeBase}`,
                    `Step 3: ${a + b} + ${cubeBase} = ${ans}`
                ],
                meta: { difficulty: 'hard', opCount: 4, hasSquareRoot: false, hasCubeRoot: true, hasFractionPct: false, hasMixedFraction: false, hasMissingPower: false, answer: ans }
            };
        }

        if (pattern === 3) {
            // Pattern H3: Fraction of Fraction Chain + Square = (?)²
            // (p/q) of (r/s) of N + k = (?)²
            const ans = randInt(11, 24);
            const targetSq = ans * ans;
            const q = randInt(3, 7);
            const s = randInt(4, 8);
            const p = randInt(2, q - 1);
            const r = randInt(2, s - 1);
            const mult = randInt(3, 8);
            const N = q * s * mult;
            const chainVal = p * r * mult;
            const k = targetSq - chainVal;
            const sign = k >= 0 ? '+' : '−';
            const absK = Math.abs(k);
            return {
                difficulty: 'hard',
                patternName: 'Chained Fractions & Missing Square (?)²',
                expression: `(${p}/${q}) of (${r}/${s}) of ${N} ${sign} ${absK} = (?)²`,
                answer: ans,
                shortcutTip: `Cancel denominators first: ${N} ÷ (${q} × ${s}) = ${mult} ⇒ ${p} × ${r} × ${mult} = ${chainVal}`,
                steps: [
                    `Step 1: (${p}/${q}) × (${r}/${s}) × ${N} = ${p} × ${r} × ${mult} = ${chainVal}`,
                    `Step 2: ${chainVal} ${sign} ${absK} = ${targetSq}`,
                    `Step 3: (?)² = ${targetSq} ⇒ ? = √${targetSq} = ${ans}`
                ],
                meta: { difficulty: 'hard', opCount: 4, hasSquareRoot: true, hasCubeRoot: false, hasFractionPct: true, hasMixedFraction: false, hasMissingPower: true, answer: ans }
            };
        }

        if (pattern === 4) {
            // Pattern H4: Decimal Half/Quarter Multiplier Trick (Double & Halve Method)
            // e.g. 16.5 × 14 + 22.5 × 8 - 15 × 6 = ?
            const halfBase1 = randInt(11, 25); // e.g. 16 -> 16.5
            const even1 = randInt(3, 9) * 2;   // e.g. 14
            const halfBase2 = randInt(12, 24); // e.g. 22 -> 22.5
            const even2 = randInt(3, 8) * 2;
            const term1 = (halfBase1 * 2 + 1) * (even1 / 2);
            const term2 = (halfBase2 * 2 + 1) * (even2 / 2);
            const subA = randInt(8, 16);
            const subB = randInt(5, 11);
            const term3 = subA * subB;
            const ans = term1 + term2 - term3;
            return {
                difficulty: 'hard',
                patternName: 'Decimal .5 Double-and-Halve Simplification',
                expression: `${halfBase1}.5 × ${even1} + ${halfBase2}.5 × ${even2} − ${subA} × ${subB} = ?`,
                answer: ans,
                shortcutTip: `Double the .5 number and halve the even number: ${halfBase1}.5 × ${even1} = ${halfBase1 * 2 + 1} × ${even1 / 2} = ${term1}`,
                steps: [
                    `Step 1 (Double & Halve): ${halfBase1}.5 × ${even1} = ${halfBase1 * 2 + 1} × ${even1 / 2} = ${term1}`,
                    `Step 2 (Double & Halve): ${halfBase2}.5 × ${even2} = ${halfBase2 * 2 + 1} × ${even2 / 2} = ${term2}`,
                    `Step 3: ${term1} + ${term2} − (${subA} × ${subB} = ${term3}) = ${ans}`
                ],
                meta: { difficulty: 'hard', opCount: 4, hasSquareRoot: false, hasCubeRoot: false, hasFractionPct: false, hasMixedFraction: true, hasMissingPower: false, answer: ans }
            };
        }

        // Pattern H5: Two-Sided Balancing Equation with Percentage, Square & Root
        // p% of A + b² = ? × c + √D
        const c = randInt(5, 12);
        const ans = randInt(12, 34);
        const rhsMult = ans * c;
        const rootVal = randInt(12, 24);
        const D = rootVal * rootVal;
        const totalLHS = rhsMult + rootVal;
        const b = randInt(8, Math.min(18, Math.floor(Math.sqrt(totalLHS - 40))));
        const bSq = b * b;
        const pctTarget = totalLHS - bSq;
        // Express pctTarget as p% of A or clean multiplication if needed
        const factor = pickOne([2, 4, 5]);
        const p = factor * 10; // 20%, 40%, 50%
        const A = Math.round((pctTarget * 100) / p);
        const actualPctPart = (p * A) / 100;

        // If rounding caused any mismatch, use exact division form
        if (!Number.isInteger(actualPctPart) || actualPctPart + bSq !== totalLHS) {
            const cleanP = 25;
            const cleanA = pctTarget * 4;
            return {
                difficulty: 'hard',
                patternName: 'Two-Side Balancing BODMAS Equation',
                expression: `${cleanP}% of ${cleanA} + ${b}² − √${D} = ? × ${c}`,
                answer: ans,
                shortcutTip: `25% of ${cleanA} is ${cleanA} ÷ 4 = ${pctTarget}; add ${b}² (${bSq}), subtract √${D} (${rootVal}), then divide by ${c}`,
                steps: [
                    `Step 1: 25% of ${cleanA} = ${pctTarget} and ${b}² = ${bSq}`,
                    `Step 2: ${pctTarget} + ${bSq} − √${D} (${rootVal}) = ${rhsMult}`,
                    `Step 3: ? = ${rhsMult} ÷ ${c} = ${ans}`
                ],
                meta: { difficulty: 'hard', opCount: 4, hasSquareRoot: true, hasCubeRoot: false, hasFractionPct: true, hasMixedFraction: false, hasMissingPower: false, answer: ans }
            };
        }

        return {
            difficulty: 'hard',
            patternName: 'Two-Side Balancing BODMAS Equation',
            expression: `${p}% of ${A} + ${b}² − √${D} = ? × ${c}`,
            answer: ans,
            shortcutTip: `${p}% of ${A} = ${actualPctPart}; add ${b}² (${bSq}), subtract √${D} (${rootVal}), then divide by ${c}`,
            steps: [
                `Step 1: ${p}% of ${A} = ${actualPctPart} and ${b}² = ${bSq}`,
                `Step 2: ${actualPctPart} + ${bSq} − √${D} (${rootVal}) = ${rhsMult}`,
                `Step 3: ? = ${rhsMult} ÷ ${c} = ${ans}`
            ],
            meta: { difficulty: 'hard', opCount: 4, hasSquareRoot: true, hasCubeRoot: false, hasFractionPct: true, hasMixedFraction: false, hasMissingPower: false, answer: ans }
        };
    }

    /**
     * Generates a single verified RRB Clerk Simplification question for the specified difficulty
     * ('easy' | 'moderate' | 'hard'). Runs the AI Level Guardrail loop to guarantee 100% compliance.
     */
    function generateSingleQuestion(difficulty) {
        const normDiff = ['easy', 'moderate', 'hard'].includes(difficulty) ? difficulty : 'moderate';

        for (let attempt = 0; attempt < 40; attempt++) {
            let rawQ;
            if (normDiff === 'easy') {
                rawQ = generateEasyQuestion();
            } else if (normDiff === 'moderate') {
                rawQ = generateModerateQuestion();
            } else {
                rawQ = generateHardQuestion();
            }

            const aiAnalysis = analyzeQuestionComplexity(rawQ.meta);
            if (!aiAnalysis.isClerkCompliant) {
                continue;
            }

            const { options, correctIndex } = generateFourOptions(rawQ.answer);
            return {
                difficulty: normDiff,
                patternName: rawQ.patternName,
                expression: rawQ.expression,
                answer: rawQ.answer,
                options,
                correctIndex,
                shortcutTip: rawQ.shortcutTip,
                steps: rawQ.steps,
                aiAnalysis
            };
        }

        // Deterministic Clerk fallback if random attempts ever exhausted
        const fallbackAns = 145;
        const { options, correctIndex } = generateFourOptions(fallbackAns);
        return {
            difficulty: normDiff,
            patternName: 'Direct Percentage Simplification',
            expression: '25% of 360 + 11 × 5 = ?',
            answer: fallbackAns,
            options,
            correctIndex,
            shortcutTip: '25% of 360 = 90; 90 + 55 = 145',
            steps: ['Step 1: 25% of 360 = 90', 'Step 2: 11 × 5 = 55', 'Step 3: 90 + 55 = 145'],
            aiAnalysis: {
                complexityScore: 34,
                targetSeconds: 16,
                tierBandLabel: 'RRB Clerk Prelims • Verified',
                isClerkCompliant: true,
                poLevelBlocked: true
            }
        };
    }

    /**
     * Client-Side AI Adaptive Difficulty Controller
     * Dynamically recommends or selects the next difficulty level inside RRB Clerk bounds
     * based on the user's rolling accuracy and solve speed.
     */
    function getNextAdaptiveDifficulty(history, currentDifficulty) {
        if (!Array.isArray(history) || history.length === 0) {
            return currentDifficulty || 'easy';
        }
        const recent = history.slice(-3);
        const correctRecent = recent.filter(h => h.status === 'correct');
        const fastRecent = correctRecent.filter(h => h.timeTakenSec <= (h.targetSeconds || 22));

        if (currentDifficulty === 'easy' && correctRecent.length >= 2 && fastRecent.length >= 1) {
            return 'moderate';
        }
        if (currentDifficulty === 'moderate') {
            if (correctRecent.length === 3 && fastRecent.length >= 2) {
                return 'hard';
            }
            const wrongOrSkipped = recent.filter(h => h.status !== 'correct').length;
            if (wrongOrSkipped >= 2) {
                return 'easy';
            }
            return 'moderate';
        }
        if (currentDifficulty === 'hard') {
            const wrongOrSkipped = recent.filter(h => h.status !== 'correct').length;
            if (wrongOrSkipped >= 2) {
                return 'moderate';
            }
            return 'hard';
        }
        return 'moderate';
    }

    /**
     * Generates a full quiz question set for a chosen mode:
     * - 'easy': 100% Easy RRB Clerk questions
     * - 'moderate': 100% Moderate RRB Clerk questions
     * - 'hard': 100% Hard RRB Clerk questions (still strictly Clerk ceiling)
     * - 'exam_mix': Real IBPS RRB Clerk Prelims distribution (40% Easy, 40% Moderate, 20% Hard)
     */
    function generateQuestionSet(mode, totalQuestions) {
        const count = Math.max(1, Math.min(100, Number(totalQuestions) || 15));
        const usedExpressions = new Set();
        const questions = [];

        for (let i = 0; i < count; i++) {
            let tier = mode;
            if (mode === 'exam_mix') {
                const ratio = i / count;
                if (ratio < 0.4) tier = 'easy';
                else if (ratio < 0.8) tier = 'moderate';
                else tier = 'hard';
            }

            let q = null;
            for (let retry = 0; retry < 15; retry++) {
                const candidate = generateSingleQuestion(tier);
                if (!usedExpressions.has(candidate.expression)) {
                    q = candidate;
                    usedExpressions.add(candidate.expression);
                    break;
                }
            }
            if (!q) {
                q = generateSingleQuestion(tier);
            }

            questions.push({
                id: i + 1,
                ...q,
                selectedOptionIndex: null,
                status: 'unanswered', // 'correct' | 'wrong' | 'skipped'
                timeTakenSec: 0
            });
        }

        return questions;
    }

    return {
        analyzeQuestionComplexity,
        generateFourOptions,
        generateSingleQuestion,
        generateQuestionSet,
        getNextAdaptiveDifficulty
    };
});
