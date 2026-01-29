import React from 'react';
import { Package, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ResourceForm = () => {
    const navigate = useNavigate();

    return (
        <div className="p-6">
            <div className="max-w-2xl mx-auto bg-surface rounded-2xl shadow-sm border border-white/10 p-8 relative">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 right-4 p-2 bg-black/20 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-bold mb-6 text-white">Add New Resource Stock</h2>

                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Resource Name</label>
                        <input type="text" className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. Rice Bags (50kg)" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                            <select className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none">
                                <option className="bg-gray-800">Food</option>
                                <option className="bg-gray-800">Water</option>
                                <option className="bg-gray-800">Medical</option>
                                <option className="bg-gray-800">Clothing</option>
                                <option className="bg-gray-800">Equipment</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Quantity</label>
                            <input type="number" className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder="Amount" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Unit</label>
                        <input type="text" className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. Kg, Liters, Boxes" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Warehouse Location</label>
                        <select className="w-full px-4 py-2 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-primary outline-none">
                            <option className="bg-gray-800">Central Warehouse, Kochi</option>
                            <option className="bg-gray-800">District Store, Wayanad</option>
                            <option className="bg-gray-800">Relief Camp 1 Storage</option>
                        </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex-1 py-3 bg-black/20 text-gray-300 font-bold rounded-xl hover:bg-white/10 transition border border-white/10"
                        >
                            Cancel
                        </button>
                        <button className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
                            <Save className="w-5 h-5" /> Add to Inventory
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResourceForm;
