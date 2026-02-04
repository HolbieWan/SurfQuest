// """
// Helper function to get the appropriate Tailwind CSS classes to center the last row
// """

// export function getCenteredLastRowClass(index, total) {
//   // colonnes effectives par breakpoint selon TON système
//   const mdCols = total === 1 ? 1 : 2;
//   const lgCols = total === 1 ? 1 : total === 2 ? 2 : 3;

//   const classes = [];

//   // --- MD (2 cols) : si total impair -> dernier item seul
//   if (mdCols === 2 && total % 2 === 1 && index === total - 1) {
//     classes.push("md:col-span-2 md:flex md:justify-center");
//   }

//   // --- LG (2 ou 3 cols)
//   if (lgCols === 2) {
//     // même logique que md (2 colonnes)
//     if (total % 2 === 1 && index === total - 1) {
//       classes.push("lg:col-span-2 lg:flex lg:justify-center");
//     }
//   } else if (lgCols === 3) {
//     const r = total % 3;

//     // reste 1 -> dernier item seul (le centrer en prenant toute la ligne)
//     if (r === 1 && index === total - 1) {
//       classes.push("lg:col-span-3 lg:flex lg:justify-center");
//     }

//     // reste 2 -> les 2 derniers items : on centre tout le groupe
//     // (option simple: on met une "justify-center" sur le wrapper des 2 items)
//     if (r === 2 && index >= total - 2) {
//       classes.push("lg:flex lg:justify-center");
//     }
//   }

//   return classes.join(" ");
// }


// Exemple d'utilisation:

{/* <div className={`grid ${gridColsClass} p-4 gap-4 rounded-md w-full`}>
  {zones.map((surfzone, index) => (
    <div
      key={surfzone.id}
      className={getCenteredLastRowClass(index, zones.length)}
    >
      <SurfZoneCard surfzone={surfzone} />
    </div>
  ))}
</div>; */}