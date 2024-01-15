if (window.location.href.startsWith("https://leetcode.com/problems/")) {
    const anchor = document.querySelector("div.flex.w-full.flex-1.flex-col.gap-4.overflow-y-auto.px-4.py-5 > div.flex.items-start.justify-between.gap-4 > div.flex.items-start.gap-2 > div > a");
    if (anchor) {
        console.log(anchor.innerText);
    }
}
