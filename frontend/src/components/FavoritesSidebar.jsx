const FavoritesSidebar = () => {
  return (
    <aside className="w-[280px] bg-white border-r p-8 hidden lg:block">

      <h3 className="text-xs font-bold uppercase text-gray-400 mb-6">
        Filters
      </h3>

      <div className="space-y-4">

        <button className="w-full text-left px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-semibold shadow">
          Liked Events
        </button>

      </div>

      {/* PRO TIP */}
      <div className="mt-12 bg-purple-50 p-6 rounded-2xl">
        <h4 className="font-semibold text-purple-700 mb-2">
          Pro Tip
        </h4>

        <p className="text-sm text-gray-600 mb-3">
          Turn on calendar notifications to never miss a favorite event starting soon.
        </p>

        <button className="text-purple-600 text-sm font-medium">
          Enable Alerts
        </button>
      </div>

    </aside>
  );
};

export default FavoritesSidebar;