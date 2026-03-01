import React from 'react';
import { Banknote, ExternalLink } from 'lucide-react';

const DonationPledge = () => {
    return (
        <div className="p-4 sm:p-6 min-h-[70vh] flex flex-col items-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 w-full max-w-2xl text-left">Donate & Support</h2>

            <div className="w-full max-w-2xl bg-surface rounded-2xl border border-white/10 p-5 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-primary/20 rounded-xl">
                        <Banknote className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-white">How to Donate</h3>
                </div>
                <div className="space-y-4">
                    <div className="bg-black/20 p-4 rounded-xl border border-white/10">
                        <h4 className="font-bold text-primary mb-2">Bank Transfer</h4>
                        <p className="text-sm text-gray-400">Name: Chief Minister's Distress Relief Fund</p>
                        <p className="text-sm text-gray-400">A/C: 67319948232</p>
                        <p className="text-sm text-gray-400">IFSC: SBIN0070028</p>
                    </div>
                    <div className="bg-black/20 p-4 rounded-xl border border-white/10">
                        <h4 className="font-bold text-primary mb-2">UPI Payment</h4>
                        <p className="text-sm text-gray-400">UPI ID: cmdrf@sbi</p>
                    </div>
                    <a href="https://donation.cmdrf.kerala.gov.in" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-xl font-bold hover:bg-lime-700 transition shadow-lg shadow-lime-500/30">
                        <ExternalLink className="w-4 h-4" /> Donate via CMDRF Portal
                    </a>
                </div>
            </div>
        </div>
    );
};

export default DonationPledge;
