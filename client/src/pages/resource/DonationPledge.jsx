import React from 'react';
import { Heart, CreditCard, Gift } from 'lucide-react';

const DonationPledge = () => {
    const [activeTab, setActiveTab] = React.useState('money');

    return (
        <div className="min-h-screen bg-background">
            <header className="py-6 border-b border-white/10 mb-12">
                <div className="max-w-5xl mx-auto px-6">
                    <h1 className="text-2xl font-bold text-primary">ResQ-DMS Donation</h1>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-white mb-4">Make a Difference Today</h2>
                    <p className="text-xl text-gray-400">Your contribution helps provide essential resources to disaster victims.</p>
                </div>

                <div className="flex justify-center gap-4 mb-10">
                    <button
                        onClick={() => setActiveTab('money')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'money'
                            ? 'bg-green-600 text-white shadow-lg shadow-green-500/20 scale-105'
                            : 'bg-black/20 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        <CreditCard className="w-5 h-5" /> Donate Money
                    </button>
                    <button
                        onClick={() => setActiveTab('items')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'items'
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 scale-105'
                            : 'bg-black/20 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        <Gift className="w-5 h-5" /> Donate Items
                    </button>
                </div>

                <div className="bg-surface rounded-3xl shadow-xl border border-white/10 p-8 md:p-12 mb-12">
                    {activeTab === 'money' ? (
                        <div className="animate-fade-in">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-white mb-2">Official Relief Fund</h3>
                                <p className="text-gray-400">Directly transfer to the verified accounts below.</p>
                            </div>

                            <div className="bg-black/20 p-6 rounded-2xl border border-white/10 mb-8">
                                <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-primary" /> Bank Transfer Details
                                </h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                                        <span className="text-gray-400 font-medium">Account Name</span>
                                        <span className="text-white font-bold">ResQ-DMS Disaster Recovery Fund</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                                        <span className="text-gray-400 font-medium">Bank Name</span>
                                        <span className="text-white font-bold">State Bank of India</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                                        <span className="text-gray-400 font-medium">Account Number</span>
                                        <span className="text-primary font-bold font-mono">1234 5678 9012</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                                        <span className="text-gray-400 font-medium">IFSC Code</span>
                                        <span className="text-white font-bold font-mono">SBIN0001234</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 font-medium">Branch</span>
                                        <span className="text-white font-bold">Kalpetta, Wayanad</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-green-500/10 p-6 rounded-2xl border border-green-500/20 mb-8 text-center">
                                <p className="text-green-400 font-bold mb-2">Chief Minister's Distress Relief Fund (CMDRF)</p>
                                <p className="text-green-300/80 text-sm mb-4">You can also donate directly to the government fund.</p>
                                <a href="https://donation.cmdrf.kerala.gov.in" target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition">
                                    Visit CMDRF Portal
                                </a>
                            </div>

                            <div className="text-center">
                                <p className="text-sm text-gray-400 mb-4">Or scan to pay via UPI</p>
                                <div className="w-48 h-48 bg-white mx-auto rounded-xl flex items-center justify-center mb-4">
                                    <span className="text-black font-bold">QR CODE</span>
                                </div>
                                <p className="font-mono text-primary font-bold">upi@resqdms</p>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-fade-in">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-white mb-2">Pledge Essential Items</h3>
                                <p className="text-gray-400">Let us know what you can provide and where to pick it up.</p>
                            </div>

                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-300 mb-2">Item Category</label>
                                        <select className="w-full px-4 py-3 bg-black/20 border-2 border-white/10 text-white rounded-xl focus:border-primary focus:ring-0 outline-none">
                                            <option className="bg-gray-800">Food & Water</option>
                                            <option className="bg-gray-800">Clothing</option>
                                            <option className="bg-gray-800">Medicines</option>
                                            <option className="bg-gray-800">Bedding</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-300 mb-2">Quantity</label>
                                        <input type="text" className="w-full px-4 py-3 bg-black/20 border-2 border-white/10 text-white rounded-xl focus:border-primary outline-none" placeholder="e.g. 50 packets" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-300 mb-2">Pickup Address</label>
                                    <textarea className="w-full px-4 py-3 bg-black/20 border-2 border-white/10 text-white rounded-xl focus:border-primary outline-none" rows="3" placeholder="Enter your full address for collection..."></textarea>
                                </div>

                                <button className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl text-lg hover:bg-indigo-700 transition shadow-xl shadow-indigo-500/20">
                                    Submit Pledge
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DonationPledge;
