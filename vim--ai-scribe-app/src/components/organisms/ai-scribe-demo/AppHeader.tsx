import type { FC } from "react";

const AppLogo: FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 35 35"
      height={50}
      width={50}
      fill="none"
    >
      <path
        fill="#000"
        fill-rule="evenodd"
        d="M7.271 25.192A3.891 3.891 0 0 0 6.011 25h-.842L3 25.046v.66l.707.185v4.7L3 30.788v.659h2.81c.662 0 1.235-.125 1.72-.375a2.68 2.68 0 0 0 1.137-1.127c.274-.494.41-1.105.41-1.831 0-.52-.073-.971-.22-1.356a2.559 2.559 0 0 0-.61-.98 2.507 2.507 0 0 0-.976-.586Zm-.783 5.23a2.343 2.343 0 0 1-.612.082h-.802v-4.56h.898c.191 0 .382.027.573.082.198.055.376.162.535.32.16.153.287.379.383.678.095.293.143.68.143 1.163 0 .5-.051.903-.153 1.209-.102.305-.239.537-.41.696a1.36 1.36 0 0 1-.555.33Zm7.273-.696h.812l-.02 1.721H9.576v-.66l.707-.196V25.89l-.707-.185v-.659L11.62 25h2.829v1.649h-.813l-.151-.706h-1.836v1.768h2.054v.907H11.65v1.886h1.95l.16-.778Zm8.616-3.836.697-.23V25l-2.207.046-1.57 3.286L17.8 25l-2.38.046v.66l.708.181v4.704l-.707.197v.66h2.513v-.66l-.707-.188v-3.8l1.481 3.017.86-.046 1.548-2.975v3.796l-.707.196v.66h2.666v-.66l-.698-.194V25.89Zm2.465 5.41c.446.245.971.367 1.576.367.657 0 1.227-.137 1.71-.412a2.89 2.89 0 0 0 1.128-1.19c.274-.52.411-1.136.411-1.85 0-.525-.073-.986-.22-1.383a2.72 2.72 0 0 0-.62-1.008 2.562 2.562 0 0 0-.956-.613c-.37-.14-.787-.21-1.252-.21-.471 0-.901.072-1.29.219-.382.14-.713.354-.994.641-.28.28-.497.635-.65 1.062-.152.428-.229.925-.229 1.493 0 .708.121 1.303.363 1.786.242.482.583.848 1.023 1.099Zm2.532-.86c-.248.146-.532.22-.85.22a1.58 1.58 0 0 1-.86-.23c-.236-.158-.418-.402-.545-.732-.128-.336-.191-.778-.191-1.328 0-.598.066-1.068.2-1.41.14-.342.335-.586.583-.733.249-.146.532-.22.85-.22.332 0 .619.074.86.22.243.147.43.388.564.724.14.33.21.77.21 1.319 0 .592-.076 1.065-.229 1.419-.146.348-.344.598-.592.75Z"
        clip-rule="evenodd"
      />
      <path
        stroke="#000"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.4"
        d="M19.05 13.2c0 1.575-1.338 2.9-3.05 2.9-1.712 0-3.05-1.325-3.05-2.9V6.6c0-1.575 1.338-2.9 3.05-2.9 1.712 0 3.05 1.325 3.05 2.9v6.6Z"
      />
      <path
        stroke="#000"
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M18.25 6h-.75m-.25 2h-.75m1.75 2h-.75m-.25 2h-.75m1.75 2h-.75m-2.25-8h-.75m-.25 2h-.75m1.75 2h-.75m-.25 2h-.75m1.75 2h-.75"
      />
      <path
        stroke="#000"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.4"
        d="M16 17v3m-5.25-7.879v1.08c0 2.784 2.35 5.04 5.25 5.04s5.25-2.256 5.25-5.04v-1.08M8.75 22H8m4 0h-.75m4 0h-.75m4 0h-.75m4 0H21m4 0h-.75"
      />
    </svg>
  );
};

export const AppHeader = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-2">
          <AppLogo />
          <h1 className="text-3xl font-bold">AI Scribe Demo</h1>
        </div>
      </div>
    </header>
  );
};
