import { c as create_ssr_component } from "../../chunks/ssr.js";
/* empty css                */const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: "html{background-image:linear-gradient(45deg, #e558fd, #cca7e4, #8f71e7)}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="relative flex items-center justify-center h-screen"><img class="absolute z-10 w-24 top-36" src="./src/multimedia/Logo.png" alt="Insight logo"> <form action="" class="absolute grid grid-cols-1 pb-6 space-y-6 place-items-center bg-beige rounded-xl w-80"><h1 class="mt-16 text-2xl text-darkblue" data-svelte-h="svelte-k94voq">Insight</h1> <div class="grid grid-cols-1 place-items-start" data-svelte-h="svelte-16deark"><label for="">Korisnicko ime:</label> <input type="text" class="px-3 py-1 bg-bgbrown rounded-xl"></div> <div class="grid grid-cols-1 place-items-start" data-svelte-h="svelte-1vljd9b"><label for="">Lozinka:</label> <input type="password" class="px-3 py-1 bg-bgbrown rounded-xl"></div> <button class="px-20 py-1 bg-darkblue text-beige rounded-xl hover:bg-strongpurple" type="submit" data-svelte-h="svelte-93tixb">Log in</button></form> </div>`;
});
export {
  Page as default
};
