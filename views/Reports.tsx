import React, { useMemo } from 'react';
import { getReports } from '../data/store';
import { AlertTriangle, ExternalLink, User } from 'lucide-react';

const Reports: React.FC = () => {
  const reports = useMemo(() => getReports(), []);

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Evidence Records</h2>
                <p className="text-sm text-gray-500">{reports.length} source-linked government, NGO, and community records</p>
            </div>
        </div>

        {reports.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center text-gray-400 shadow-sm border border-gray-100">
            No reports logged yet.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
                <div key={report.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-2">
                            <span className={`p-1.5 rounded-full ${
                                report.severity === 'Critical' ? 'bg-red-100 text-red-600' :
                                report.severity === 'High' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                            }`}>
                                <AlertTriangle className="w-4 h-4" />
                            </span>
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{report.parish}</span>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            report.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                            report.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                            report.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                        }`}>{report.severity}</span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-1">{report.communityName}</h3>
                    <p className="text-gray-600 text-sm mb-4 flex-grow">{report.issue}</p>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center text-xs text-gray-500">
                            <User className="w-3 h-3 mr-1" />
                            {report.reporterType}
                        </div>
                        <a
                          href={report.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-800"
                        >
                          Source <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default Reports;
