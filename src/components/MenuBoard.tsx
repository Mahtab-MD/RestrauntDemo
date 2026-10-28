import React, { useState } from 'react';
import { Info, Search, X, ArrowRight, MessageCircle } from 'lucide-react';
import menuData from '../data/menu.json';
import {
  filterMenuCategories,
  buildWhatsAppOrderUrl,
  MenuCategoryData,
} from '../utils/restaurantLogic';

interface MenuBoardProps {
  showSearch?: boolean;
  showAllergenNotice?: boolean;
  onNavigate?: (path: string) => void;
}

export const MenuBoard: React.FC<MenuBoardProps> = ({
  showSearch = false,
  showAllergenNotice = true,
  onNavigate,
}) => {
  const [vegOnly, setVegOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(menuData.categories[0].id);

  const { restaurant } = menuData;
  const categories = menuData.categories as MenuCategoryData[];
  const filteredCategories = filterMenuCategories(categories, { vegOnly, searchQuery });

  const totalVisibleItems = filteredCategories.reduce((acc, cat) => acc + cat.items.length, 0);

  const handleCategoryJump = (e: React.MouseEvent<HTMLAnchorElement>, catId: string) => {
    e.preventDefault();
    setActiveCategory(catId);
    const el = document.getElementById(catId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="site-container py-8 sm:py-12" id="full-menu">
      {/* Sticky Category Bar & Veg-Only Switch */}
      <div className="sticky top-[52px] z-40 bg-[#FAF6F0]/95 backdrop-blur-sm pt-3 pb-3 border-b border-[#E5DDD2] mb-6">
        {/* Top Row: "Full rate board" label on left, clean Veg Only switch vertically centered on right */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-baseline gap-2 min-w-0">
            <h2 className="font-heritage font-bold text-[20px] sm:text-[26px] text-[#1F1A17] leading-none whitespace-nowrap">
              Full rate board
            </h2>
            <span className="hidden sm:inline text-[13px] text-[#5C534E] whitespace-nowrap">
              ({totalVisibleItems} {totalVisibleItems === 1 ? 'dish' : 'dishes'})
            </span>
          </div>

          {/* Clean Single Switch for Veg Only (with hidden checkbox #vegFilterToggle for automated & keyboard accessibility) */}
          <label
            htmlFor="vegFilterToggle"
            className="inline-flex items-center gap-2 cursor-pointer select-none min-h-[44px] px-1 shrink-0"
          >
            <input
              id="vegFilterToggle"
              type="checkbox"
              role="switch"
              aria-checked={vegOnly}
              checked={vegOnly}
              onChange={(e) => setVegOnly(e.target.checked)}
              className="sr-only"
            />
            <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#1F1A17] whitespace-nowrap">
              <span className="veg-badge" aria-hidden="true">
                <span className="veg-dot" />
              </span>
              <span>Veg only</span>
            </span>
            <span
              aria-hidden="true"
              className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border transition-subtle ${
                vegOnly
                  ? 'bg-[#1E6B3A] border-[#1E6B3A]'
                  : 'bg-[#E5DDD2] border-[#CFC4B4]'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transform transition-subtle mt-[1px] ${
                  vegOnly ? 'translate-x-[21px]' : 'translate-x-[1px]'
                }`}
              />
            </span>
          </label>
        </div>

        {/* Optional Dish Search Input (on /menu page) */}
        {showSearch && (
          <div className="mb-3">
            <label htmlFor="menu-search-input" className="sr-only">
              Search dishes in the menu
            </label>
            <div className="relative">
              <Search
                className="w-4 h-4 text-[#5C534E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="menu-search-input"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search biryani, chicken 65, paneer, naan..."
                className="w-full h-11 bg-white border border-[#E5DDD2] rounded-lg pl-10 pr-10 text-[15px] text-[#1F1A17] placeholder:text-[#8C827A]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search query"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 inline-flex items-center justify-center text-[#5C534E] hover:text-[#1F1A17]"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Horizontally Scrollable Category Tabs with Scroll-Snap and Right-Edge Fade */}
        <div className="category-scroll-fade">
          <div
            role="navigation"
            aria-label="Menu categories"
            className="flex items-center gap-2 overflow-x-auto no-scrollbar snap-x snap-mandatory pr-8 py-0.5"
          >
            {categories.map((cat) => {
              const isSelected = activeCategory === cat.id;
              return (
                <a
                  key={cat.id}
                  href={`#${cat.id}`}
                  onClick={(e) => handleCategoryJump(e, cat.id)}
                  className={`snap-start h-11 px-4 rounded-lg text-[14px] font-semibold whitespace-nowrap shrink-0 inline-flex items-center justify-center transition-subtle border ${
                    isSelected
                      ? 'bg-[#6E1D1B] text-white border-[#6E1D1B]'
                      : 'bg-[#F3ECE1] text-[#1F1A17] border-[#E5DDD2] hover:bg-[#EAE0D3]'
                  }`}
                >
                  {cat.shortLabel}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Empty Filter State */}
      {filteredCategories.length === 0 && (
        <div className="bg-white border border-[#E5DDD2] rounded-xl p-6 text-center my-6">
          <p className="font-heritage font-semibold text-[18px] text-[#1F1A17]">
            No dishes match your filter.
          </p>
          <p className="text-[15px] text-[#5C534E] mt-1">
            Clear your search or switch off Veg only to view all 26 dishes.
          </p>
          <button
            type="button"
            onClick={() => {
              setVegOnly(false);
              setSearchQuery('');
            }}
            className="mt-4 h-11 px-5 bg-[#6E1D1B] text-white text-[14px] font-semibold rounded-lg hover:bg-[#571614] transition-subtle"
          >
            Show All Dishes
          </button>
        </div>
      )}

      {/* Menu Category Cards */}
      <div className="space-y-8">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            id={category.id}
            className="bg-white border border-[#E5DDD2] rounded-xl p-4 sm:p-6 shadow-xs scroll-mt-40"
          >
            {/* Category Section Header: Heading on left, timing on right, stacked cleanly if narrow */}
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 pb-3 mb-2 border-b border-[#E5DDD2]">
              <div>
                <h3 className="text-[20px] sm:text-[22px] font-heritage font-bold text-[#1F1A17]">
                  {category.name}
                </h3>
                <p className="text-[13px] text-[#5C534E] mt-0.5">{category.subtitle}</p>
              </div>
              <span className="text-[13px] font-medium text-[#6E1D1B] whitespace-nowrap">
                {category.timingBadge}
              </span>
            </div>

            {/* Menu Items: Strict 2-Column Grid Per Row */}
            <div className="divide-y divide-[#E5DDD2]">
              {category.items.map((item) => {
                const isVeg = item.type === 'V';
                const itemOrderUrl = buildWhatsAppOrderUrl(
                  restaurant.whatsappNumber,
                  `${item.name} (₹${item.price})`
                );

                return (
                  <div
                    key={item.id}
                    data-testid={`menu-item-${item.id}`}
                    data-type={isVeg ? 'veg' : 'non-veg'}
                    className="menu-item grid grid-cols-[1fr_auto] items-start gap-4 py-4"
                  >
                    {/* Left Column: 14px Veg/Non-Veg Marker, Name, Own-Line Badge, Short Description */}
                    <div className="min-w-0 grid grid-cols-[14px_1fr] items-start gap-2.5">
                      <div className="pt-[5px]">
                        {isVeg ? (
                          <span className="veg-badge" title="Vegetarian" aria-label="Vegetarian">
                            <span className="veg-dot" />
                          </span>
                        ) : (
                          <span
                            className="non-veg-badge"
                            title="Non-Vegetarian"
                            aria-label="Non-Vegetarian"
                          >
                            <span className="non-veg-dot" />
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <h4 className="font-heritage font-semibold text-[17px] leading-snug text-[#1F1A17] break-words">
                          {item.name}
                        </h4>

                        {item.badge === 'Signature' && (
                          <div className="mt-0.5">
                            <span className="inline-block text-[12px] font-semibold text-[#6E1D1B]">
                              Signature
                            </span>
                          </div>
                        )}

                        <p className="text-[15px] leading-[1.5] text-[#5C534E] mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Right Column: Price & Order Action Aligned to One Vertical Axis */}
                    <div className="flex flex-col items-end justify-start text-right shrink-0 min-w-[88px]">
                      <span className="tabular-price font-bold text-[17px] leading-snug text-[#1F1A17]">
                        ₹{item.price}
                      </span>
                      <a
                        href={itemOrderUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Order ${item.name} for ₹${item.price} on WhatsApp`}
                        className="mt-2 inline-flex items-center justify-end gap-1.5 min-h-[44px] px-3 py-1.5 rounded-lg text-[13px] font-semibold text-[#6E1D1B] bg-[#FAF6F0] border border-[#E5DDD2] hover:bg-[#6E1D1B] hover:text-white transition-subtle whitespace-nowrap"
                      >
                        <MessageCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span>Order</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Allergen Notice: Icon & Text on 1 Grid, Full-Width Button on Mobile, No FSSAI Duplicate */}
      {showAllergenNotice && (
        <div
          role="note"
          aria-label="Allergen and food safety notice"
          className="mt-8 bg-[#F3ECE1] border border-[#E5DDD2] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="grid grid-cols-[20px_1fr] items-start gap-3">
            <Info className="w-5 h-5 text-[#6E1D1B] mt-0.5 shrink-0" aria-hidden="true" />
            <div>
              <h4 className="font-heritage font-semibold text-[16px] text-[#1F1A17]">
                Allergen &amp; kitchen notice
              </h4>
              <p className="text-[15px] text-[#5C534E] mt-0.5 leading-relaxed">
                {restaurant.allergenNotice}
              </p>
            </div>
          </div>

          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('/menu')}
              className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 rounded-lg bg-white border border-[#E5DDD2] text-[14px] font-semibold text-[#1F1A17] hover:bg-[#FAF6F0] inline-flex items-center justify-center gap-1.5 transition-subtle shrink-0"
            >
              <span>Open Full Menu Page</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>
      )}
    </section>
  );
};
