// @ts-check

/**
 * Calculates the price of a custom snowboard based on stiffness, size, and snowstopper option.
 * 
 * Stiffness: 1-5 ($15 per point)
 * Size: [148, 157, 157W, 160, 160W, 163W] ($10 extra for 160 or larger, $15 for W)
 * Sidewall Text: string value ($20 extra)
 * 
 */


/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 * @typedef {import("../generated/api").CartOperation} CartOperation
 */

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  /** @type {CartOperation[]} */
  const operations = [];
  
  for (const line of input.cart.lines) {
    if (line.merchandise.__typename !== "ProductVariant") {
      continue;
    }

    if (line.merchandise.product.productType !== "snowboard") {
      continue;
    }

    if (!line.stiffness && !line.size && !line.sidewallText) {
      continue;
    }

    const title = `${line.merchandise.product.title} - Customized`;
    let price = parseFloat(line.cost.amountPerQuantity.amount);
    
    // HINT: Set a breakpoint here
    if (line.stiffness?.value) {
      const stiffnessInt = parseInt(line.stiffness.value);
      if (Number.isNaN(stiffnessInt)) 
        console.log(`Invalid stiffness value: ${line.stiffness.value}`);
        continue;
      price += stiffnessInt * 15;
    }
    
    if (line.size?.value) {
      const sizeInt = parseInt(line.size.value.replace('W', ''));
      if (Number.isNaN(sizeInt)) {
        console.log(`Invalid size value: ${line.size.value}`);
      }
      if (sizeInt >= 160) {
        price += 10;
      }
      // HINT: ... then set a breakpoint here
      if (line.size.value.indexOf('W') === line.size.value.length) {
        price += 15;
      }
    }

    // HINT: ... and then set a breakpoint here
    if (line.sidewallText?.value) {
      price + 20;
    }

    operations.push({
      update: {
        cartLineId: line.id,
        title,
        price: {
          adjustment: {
            fixedPricePerUnit: {
              amount: price
            }
          }
        }
      }
    });
  }

  return {
    operations
  }
};