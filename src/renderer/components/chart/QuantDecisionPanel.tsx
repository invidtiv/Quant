import { useEffect, useState } from 'react';
import type {
  ChartRange,
  DataSource,
  EarningsEvent,
  QuantJournalEntry,
  QuantJournalStatus,
  ValuationSnapshot,
} from '../../../shared/types';
import type { SignalEvaluation } from '../../../shared/quant';
import { api } from '../../api';

function label(value: string): string {
  return value.replaceAll('-', ' ');
}

function fmt(value: number, digits = 2): string {
  return Number.isFinite(value) ? value.toFixed(digits) : 'n/a';
}

function fmtMoney(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return 'n/a';
  const abs = Math.abs(value).toFixed(2);
  return value < 0 ? `-$${abs}` : `$${abs}`;
}

export function QuantDecisionPanel({
  evaluation,
  earnings,
  valuation,
  range,
  chartSource,
  chartAsOf,
}: {
  evaluation: SignalEvaluation | null;
  earnings: EarningsEvent | null;
  valuation: ValuationSnapshot | null;
  range: ChartRange;
  chartSource?: DataSource;
  chartAsOf?: string;
}) {
  if (!evaluation) {
    return (
      <aside className="cm-quant" aria-label="Quant signal">
        <div className="cm-quant-head">
          <h3>Signal Desk</h3>
          <p>Waiting for candles.</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="cm-quant" aria-label="Quant signal">
      <div className="cm-quant-head">
        <div>
          <h3>Signal Desk</h3>
          <p>{evaluation.strategyVersion}</p>
        </div>
        <span className={`cm-decision ${evaluation.decision}`}>{label(evaluation.decision)}</span>
      </div>

      <div
        className="cm-score-row"
        title="Signal score is an explainable 0-100 quality score. Higher means more explicit rule evidence supports the trade setup. It is not a probability of profit. Penalties come from blockers such as weak volume, poor reward/risk, choppy regime, or price too close to support/resistance."
      >
        <div>
          <span className="cm-score num">{evaluation.confidence}</span>
          <span className="cm-score-max">/100</span>
        </div>
        <div className="cm-score-meta">
          <span>{label(evaluation.setupType)}</span>
          <span>{label(evaluation.regime)}</span>
        </div>
      </div>

      <p className="cm-signal-reason">{evaluation.reason}</p>

      <div className="cm-risk-grid">
        <div><span>Entry</span><b className="num">{fmt(evaluation.risk.entry)}</b></div>
        <div><span>Stop</span><b className="num">{fmt(evaluation.risk.stop)}</b></div>
        <div><span>Target 1</span><b className="num">{fmt(evaluation.risk.target1)}</b></div>
        <div><span>Target 2</span><b className="num">{fmt(evaluation.risk.target2)}</b></div>
        <div><span>R/R</span><b className="num">{fmt(evaluation.risk.rewardRisk1)}R</b></div>
        <div><span>Size</span><b className="num">{evaluation.risk.positionSize}</b></div>
      </div>

      {evaluation.noTradeReasons.length > 0 && (
        <div className="cm-blockers">
          <span>No-trade blockers</span>
          <ul>
            {evaluation.noTradeReasons.slice(0, 4).map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="cm-components">
        {evaluation.components.map((component) => (
          <div key={component.name} className={`cm-component ${component.status}`}>
            <div>
              <span>{component.name}</span>
              <p>{component.explanation}</p>
            </div>
            <b className="num">{component.score >= 0 ? '+' : ''}{component.score}</b>
          </div>
        ))}
      </div>

      <div className="cm-analytics">
        <span>Analytics</span>
        <div>
          <b>ATR</b><em className="num">{evaluation.analytics.atr14 ?? 'n/a'}</em>
          <b>Vol</b><em className="num">{evaluation.analytics.volumeRatio ?? 'n/a'}x</em>
          <b>BT win</b><em className="num">{evaluation.backtest.winRate}%</em>
          <b>Exp</b><em className="num">{evaluation.backtest.expectancy}R</em>
        </div>
      </div>

      <div className="cm-evidence-desk">
        <div className="cm-evidence-head">
          <span>Evidence-backed snapshot</span>
          <em>{chartAsOf ? `as of ${new Date(chartAsOf).toLocaleDateString()}` : 'as-of unavailable'}</em>
        </div>
        <div><b>E1</b><span>Signal rules</span><em>{evaluation.strategyVersion}</em><i className="verified">verified</i></div>
        <div><b>E2</b><span>Chart candles</span><em>{chartSource ?? 'unknown'}</em><i className={chartSource === 'live' ? 'verified' : 'warning'}>{chartSource ?? 'unknown'}</i></div>
        <div><b>E3</b><span>Backtest sample</span><em>{evaluation.backtest.totalTrades} trades</em><i className={evaluation.backtest.totalTrades >= 20 ? 'verified' : 'warning'}>{evaluation.backtest.totalTrades >= 20 ? 'usable' : 'thin'}</i></div>
        <div><b>E4</b><span>Earnings</span><em>{earnings?.date ?? 'unavailable'}</em><i className={earnings?.source === 'live' ? 'verified' : 'warning'}>{earnings?.source ?? 'missing'}</i></div>
        <div><b>E5</b><span>Valuation</span><em>{valuation?.companyName ?? 'unavailable'}</em><i className={valuation?.source === 'live' ? 'verified' : 'warning'}>{valuation?.source ?? 'missing'}</i></div>
      </div>

      <DecisionJournal evaluation={evaluation} range={range} />

      {valuation && (
        <div className="cm-valuation">
          <span>Valuation</span>
          <div className="cm-valuation-grid">
            <b>P/E</b><em className="num">{valuation.trailingPe ?? 'n/a'}</em>
            <b>P/S</b><em className="num">{valuation.priceToSales ?? 'n/a'}</em>
            <b>Margin</b>
            <em className="num">
              {valuation.profitMargin !== null ? `${(valuation.profitMargin * 100).toFixed(1)}%` : 'n/a'}
            </em>
            <b>Rev growth</b>
            <em className="num">
              {valuation.revenueGrowth !== null ? `${(valuation.revenueGrowth * 100).toFixed(1)}%` : 'n/a'}
            </em>
          </div>
          <ul>
            {valuation.estimates.slice(0, 3).map((estimate) => (
              <li key={estimate.label}>
                <strong>{estimate.label}</strong>
                <span className="num">
                  {estimate.fairValue !== null ? `$${estimate.fairValue.toFixed(2)}` : 'n/a'}
                  {estimate.upsidePercent !== null ? ` (${estimate.upsidePercent > 0 ? '+' : ''}${estimate.upsidePercent.toFixed(1)}%)` : ''}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {earnings && (
        <div className="cm-earnings-context">
          <span>Earnings factor</span>
          <p>
            Expected EPS <b className="num">{fmtMoney(earnings.epsEstimate)}</b>
            {earnings.epsActual !== null && earnings.epsActual !== undefined && (
              <>
                {' '}vs latest actual <b className="num">{fmtMoney(earnings.epsActual)}</b>
              </>
            )}
            {earnings.epsSurprisePercent !== null && earnings.epsSurprisePercent !== undefined && (
              <>
                {' '}(<b className={earnings.epsSurprisePercent >= 0 ? 'up num' : 'down num'}>
                  {earnings.epsSurprisePercent > 0 ? '+' : ''}
                  {earnings.epsSurprisePercent.toFixed(1)}%
                </b> surprise)
              </>
            )}
            .
          </p>
          <em>
            Earnings beats can support multiple expansion; misses can invalidate a chart setup even before price breaks the stop.
          </em>
        </div>
      )}

    </aside>
  );
}

function DecisionJournal({ evaluation, range }: { evaluation: SignalEvaluation; range: ChartRange }) {
  const [entries, setEntries] = useState<QuantJournalEntry[]>([]);
  const [status, setStatus] = useState<QuantJournalStatus>('planned');
  const [thesis, setThesis] = useState('');
  const [catalyst, setCatalyst] = useState('');
  const [invalidation, setInvalidation] = useState('');
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let cancelled = false;
    api.getQuantJournal(evaluation.symbol).then(
      (result) => {
        if (!cancelled) setEntries(result);
      },
      () => {
        if (!cancelled) setMessage('Journal could not load.');
      },
    );
    return () => {
      cancelled = true;
    };
  }, [evaluation.symbol]);

  useEffect(() => {
    setThesis((value) => value || evaluation.reason);
    setInvalidation(
      (value) =>
        value ||
        evaluation.noTradeReasons[0] ||
        `Invalidate if price closes through the ${evaluation.risk.stop} stop or the setup structure fails.`,
    );
  }, [evaluation.evaluatedAt, evaluation.noTradeReasons, evaluation.reason, evaluation.risk.stop]);

  const save = async () => {
    if (!thesis.trim() || !invalidation.trim() || busy) return;
    setBusy(true);
    setMessage('');
    try {
      const entry = await api.saveQuantJournal({
        symbol: evaluation.symbol,
        range,
        status,
        thesis,
        catalyst,
        invalidation,
        notes,
        evaluation,
      });
      setEntries((items) => [entry, ...items].slice(0, 30));
      setMessage('Decision snapshot saved locally.');
      setNotes('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Journal save failed.');
    } finally {
      setBusy(false);
    }
  };

  const latest = entries[0];
  return (
    <section className="cm-journal" aria-label="Decision journal">
      <div className="cm-journal-head">
        <div>
          <span>Decision Journal</span>
          <p>Save the thesis and invalidation with this exact signal snapshot.</p>
        </div>
        <select value={status} onChange={(event) => setStatus(event.currentTarget.value as QuantJournalStatus)} aria-label="Decision status">
          <option value="planned">Planned</option>
          <option value="active">Active</option>
          <option value="invalidated">Invalidated</option>
          <option value="closed">Closed</option>
        </select>
      </div>
      <label>
        <span>Thesis</span>
        <textarea value={thesis} onChange={(event) => setThesis(event.currentTarget.value)} rows={3} />
      </label>
      <label>
        <span>Catalyst or trigger</span>
        <input value={catalyst} onChange={(event) => setCatalyst(event.currentTarget.value)} placeholder="What must happen before acting?" />
      </label>
      <label>
        <span>Invalidation</span>
        <textarea value={invalidation} onChange={(event) => setInvalidation(event.currentTarget.value)} rows={2} />
      </label>
      <label>
        <span>Review notes</span>
        <input value={notes} onChange={(event) => setNotes(event.currentTarget.value)} placeholder="Optional observation or review date" />
      </label>
      <div className="cm-journal-actions">
        <button type="button" onClick={() => void save()} disabled={busy || !thesis.trim() || !invalidation.trim()}>
          {busy ? 'Saving…' : 'Save decision snapshot'}
        </button>
        {message && <span role="status">{message}</span>}
      </div>
      {latest && (
        <div className="cm-journal-latest">
          <div><b>{latest.status}</b><span>{new Date(latest.updatedAt).toLocaleString()}</span></div>
          <p>{latest.thesis}</p>
          <em>Snapshot: {label(latest.signalSnapshot.decision)} · {latest.signalSnapshot.confidence}/100 · entry {latest.signalSnapshot.entry} · stop {latest.signalSnapshot.stop}</em>
        </div>
      )}
    </section>
  );
}
