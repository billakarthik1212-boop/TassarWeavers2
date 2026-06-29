              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                  Upload Product Photos (Multi-Select)
                </label>
                <input 
                  type="file" multiple accept="image/*" 
                  onChange={(e) => setSelectedFiles(Array.from(e.target.files))} 
                  className="w-full text-xs" 
                />
              </div>
              <button 
                type="submit" 
                disabled={isSubmittingProduct} 
                className="w-full bg-tassar-madderRed text-white py-3 text-xs font-bold tracking-widest uppercase hover:bg-black transition-colors"
              >
                {isSubmittingProduct ? 'PUBLISHING...' : 'PUBLISH ITEM'}
              </button>
            </form>

            <div className="lg:col-span-8 bg-white border border-tassar-pink/40 p-5 shadow-sm">
              <h3 className="font-display text-base uppercase tracking-wider text-black font-bold mb-4">Active Inventory</h3>
              <div className="space-y-2">
                {products.map(product => (
                  <div key={product.id} className="flex items-center justify-between border-b border-tassar-pink/20 pb-2">
                    <span className="text-xs font-bold text-black">{product.name}</span>
                    <div className="flex gap-2">
                      <button onClick={() => handleToggleStock(product)} className={`text-[10px] font-bold uppercase px-2 py-1 ${product.in_stock ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                        {product.in_stock ? 'In Stock' : 'Sold Out'}
                      </button>
                      <button onClick={() => handleRemoveProduct(product.id)} className="text-tassar-madderRed hover:text-black"><FiTrash2 /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Ensure all function calls are lowercase: use set... instead of Set... and e.preventDefault() instead of E.preventDefault() */}
        {/* Example of correct function start: */}
        {/* const handleAddProductSubmit = async (e) => { e.preventDefault(); ... } */}
