import React, { useState, useMemo } from 'react';
import { generateAnalysis } from '../services/aiService';
import { getKPIs, getReports, getPromises } from '../data/store';
import { Sparkles, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const Predictions: React.FC = () => {
  const kpis    = useMemo(() => getKPIs(), []);
  const reports = useMemo(() => getReports(), []);
  const promises = useMemo(() => getPromises(), []);

  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [ran, setRan]           = useState(false);

  const run = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateAnalysis(kpis, reports, promises);
      setAnalysis(result);
      setRan(true);
    } catch {
      setError('Analysis failed. Check your API key and network connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Sparkles className="w-48 h-48" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-200">AI Analysis</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Predictions Lab</h2>
          <p className="text-indigo-100 max-w-2xl text-lg">
            Analyse real donation flows, field reports, and government promises to surface supply risks and recommendations.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 min-h-[400px] p-8">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800">Situation Analysis</h3>
          <button
            onClick={run}
            disabled={loading}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              loading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Analysing…' : ran ? 'Re-run Analysis' : 'Run Analysis'}
          </button>
        </div>

        <div className="prose prose-slate max-w-none">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-32 bg-gray-100 rounded-lg mt-8" />
            </div>
          ) : error ? (
            <div className="text-red-600 p-4 bg-red-50 rounded-lg text-sm">{error}</div>
          ) : analysis ? (
            <div className="whitespace-pre-line text-gray-700 leading-relaxed">
              <ReactMarkdown>{analysis}</ReactMarkdown>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400 text-sm text-center space-y-2">
              <Sparkles className="w-8 h-8 text-indigo-300" />
              <p>Click <strong>Run Analysis</strong> to generate an AI situation report from live ledger data.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Predictions;
