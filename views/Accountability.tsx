import React, { useMemo } from 'react';
import { getPromises, getSourceById } from '../data/store';
import { Status, SourceGrade } from '../types';
import { AlertCircle, CheckCircle, Clock, ExternalLink } from 'lucide-react';

const Accountability: React.FC = () => {
  const promises = useMemo(() => getPromises(), []);

  return (
    <div className="space-y-6">
       <div className="bg-slate-900 text-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-2">Recovery Commitments</h2>
            <p className="text-slate-300">Tracks source-linked public commitments and the evidence currently connected to this ledger. A record date is not automatically a delivery deadline.</p>
       </div>

       {promises.length === 0 && (
         <div className="bg-white rounded-xl p-12 text-center text-gray-400 shadow-sm border border-gray-100">
           No promises logged yet.
         </div>
       )}
       <div className="grid grid-cols-1 gap-6">
            {promises.map((promise) => (
                <div key={promise.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{promise.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">{promise.description}</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center
                                ${promise.status === Status.DISTRIBUTED ? 'bg-green-100 text-green-700' : 
                                  promise.status === Status.DELAYED ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {promise.status === Status.DISTRIBUTED && <CheckCircle className="w-3 h-3 mr-1"/>}
                                {promise.status === Status.DELAYED && <AlertCircle className="w-3 h-3 mr-1"/>}
                                {promise.status === Status.PLEDGED && <Clock className="w-3 h-3 mr-1"/>}
                                {promise.status}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                            {/* Financials */}
                            <div>
                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Budget figures recorded</h4>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">Spent: <span className="font-semibold text-gray-900">${promise.budgetSpent.toLocaleString()}</span></span>
                                    <span className="text-gray-600">Allocated: <span className="font-semibold text-gray-900">${promise.budgetAllocated.toLocaleString()}</span></span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div 
                                        className={`h-2.5 rounded-full ${promise.budgetSpent > promise.budgetAllocated ? 'bg-red-500' : 'bg-blue-600'}`} 
                                        style={{ width: `${Math.min((promise.budgetSpent / promise.budgetAllocated) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Timeline/Progress */}
                            <div>
                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Status recorded in this ledger</h4>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">Record date: {promise.promisedDate}</span>
                                    <span className="font-bold text-gray-900">{promise.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div 
                                        className={`h-2.5 rounded-full ${
                                            promise.progress === 100 ? 'bg-green-500' : 
                                            promise.status === Status.DELAYED ? 'bg-orange-500' : 'bg-blue-600'
                                        }`} 
                                        style={{ width: `${promise.progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Footer Actions */}
                    <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 italic">{promise.ministry ?? 'Ministry not specified'}</span>
                          {promise.provenance?.sourceId && promise.provenance.sourceId.startsWith('src-') && (() => {
                            const src = getSourceById(promise.provenance.sourceId);
                            const grade = src?.grade;
                            return (
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                grade === SourceGrade.OFFICIAL ? 'bg-green-100 text-green-700' :
                                grade === SourceGrade.PRIMARY ? 'bg-blue-100 text-blue-700' :
                                grade === SourceGrade.SECONDARY ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {grade ?? '—'}
                              </span>
                            );
                          })()}
                        </div>
                        <a
                          href={promise.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          View Source <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                    </div>
                </div>
            ))}
       </div>
    </div>
  );
};

export default Accountability;
