import React from 'react';
import { Package, Truck, ShoppingCart, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const ResourceDashboard = () => {
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">Resource Management</h2>
                <Link to="/admin/resources/new" className="px-4 py-2 bg-primary text-white font-bold rounded-xl flex items-center gap-2 hover:bg-lime-700 transition shadow-lg shadow-lime-500/30">
                    <Plus className="w-5 h-5" /> Add Resource
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                    { label: 'Food Packets', count: '1,500', unit: 'Units', color: 'bg-orange-500' },
                    { label: 'Water Bottles', count: '5,000', unit: 'Gallons', color: 'bg-blue-500' },
                    { label: 'Medical Kits', count: '300', unit: 'Kits', color: 'bg-red-500' }
                ].map((item, i) => (
                    <div key={i} className="bg-surface p-6 rounded-2xl shadow-sm border border-white/10 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400">{item.label}</p>
                            <h3 className="text-3xl font-bold text-white my-1">{item.count}</h3>
                            <span className="text-xs text-gray-500">{item.unit} Available</span>
                        </div>
                        <div className={`p-4 rounded-xl text-white ${item.color}`}>
                            <Package className="w-6 h-6" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-surface p-6 rounded-2xl shadow-sm border border-white/10">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-white"><Truck className="w-5 h-5 text-gray-400" /> Recent Shipments</h3>
                    <table className="w-full text-left">
                        <tbody>
                            {[1, 2, 3].map(i => (
                                <tr key={i} className="border-b border-white/10 last:border-0 hover:bg-white/5 transition">
                                    <td className="py-3">
                                        <p className="font-bold text-white text-sm">Shipment #{1000 + i}</p>
                                        <p className="text-xs text-gray-500">From: Kochi Hub</p>
                                    </td>
                                    <td className="py-3 text-right">
                                        <span className={i === 1 ? 'text-yellow-500' : 'text-green-500'}>{i === 1 ? 'In Transit' : 'Delivered'}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="bg-surface p-6 rounded-2xl shadow-sm border border-white/10">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-white"><ShoppingCart className="w-5 h-5 text-gray-400" /> Low Stock Alerts</h3>
                    <div className="space-y-3">
                        <div className="p-3 bg-red-900/20 rounded-lg border border-red-500/20 flex justify-between items-center">
                            <span className="font-medium text-red-500">Baby Food</span>
                            <button className="text-xs bg-transparent border border-red-500/40 px-2 py-1 rounded text-red-500 font-bold hover:bg-red-500/10">Restock</button>
                        </div>
                        <div className="p-3 bg-red-900/20 rounded-lg border border-red-500/20 flex justify-between items-center">
                            <span className="font-medium text-red-500">Blankets</span>
                            <button className="text-xs bg-transparent border border-red-500/40 px-2 py-1 rounded text-red-500 font-bold hover:bg-red-500/10">Restock</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResourceDashboard;
