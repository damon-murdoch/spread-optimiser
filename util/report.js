class Report {
  constructor(species, level, nature) {

    // Species for the table
    this.species = species;

    // Nature for the table
    this.nature = nature;

    // Level for the table
    this.level = level;

    // If this is true,
    // display will be re-called
    // after sorting.
    this.active = false;

    // Content of the table to be displayed
    this.content = [];

    // Page which is currently displayed
    this.page = 0;

    // Min. BST Value
    this.minBst = null;

    // Max. BST Value
    this.maxBst = null;


    // Number of items displayed on each page
    this.count = 20;

    // Number of pages
    this.pageCount = 0;

    // Row which the table will be filtered by
    this.row = "BST";

    // Direction which the table will be sorted
    this.asc = false;
  }

  setPage(position) {
    // Switch on the button pressed
    switch (position) {
      case "frst":
        this.page = 0; // Go to the first page
        break;
      case "prev":
        this.page = this.page - 1; // Go to the previous page
        break;
      case "next":
        this.page = this.page + 1; // Go to the next page
        break;
      case "last":
        this.page = this.pageCount; // Go to the last page
        break;
      default:
        break;
    }

    // If the page variable is too low, set it to the minimum
    if (this.page < 0) this.page = 0;

    // If the page variable is too high, set it to the maximum
    if (this.page > this.pageCount) this.page = this.pageCount;

    // If there is a live table
    if (this.active) {
      // Update the live table
      this.display();
    }
  }

  setCount(count) {
    // Update the current count variable with the new count
    this.count = count;

    // Update page count
    this.getPageCount();

    // Make sure we haven't gone past the last page
    this.setPage();

    // If there is a live table
    if (this.active) {
      // Update the live table
      this.display();
    }
  }

  getPageCount() {
    // Page count is equal to the floor of the number of variables
    this.pageCount = Math.floor(this.content.length / this.count);
  }

  insert(bst, ev, stat) {
    // Insert the given ev spread into the content array
    this.content.push({ bst: bst, evs: ev, stats: stat });

    // If new max. bst, update
    if (this.maxBst === null || bst > this.maxBst){
      this.maxBst = bst;
    }

    // If new min. bst, update
    if (this.minBst === null || bst < this.minBst){
      this.minBst = bst;
    }

    // Update the page count
    this.getPageCount();
  }

  display(page = this.page, count = this.count) {
    // Set the page number to page + 1
    const page_number = page + 1;

    // Update the page number / item count
    const pageno = document.getElementById("page-no");
    pageno.innerHTML = getCommaString(page_number);

    const itemct = document.getElementById("item-ct");
    itemct.innerHTML = getCommaString(count);

    // Get the element containing the display count
    const displayCount = document.getElementById("display-count");

    // Update the display counter
    displayCount.innerHTML = `${toCapitalCase(
      this.nature
    )} nature, ${getCommaString(this.content.length)} spreads generated.`;

    // Get the element containing the distribution report
    const displayRange = document.getElementById('display-range');

    // Range of distributions
    const range = [];

    // Loop over bst_min -> bst_max
    for(let bstCur=this.minBst; bstCur <= this.maxBst; bstCur++){
      const bstCount = this.content.filter(x => x.bst == bstCur).length;
      range.push(`${bstCur}: ${getCommaString(bstCount)}`); 
    }

    // Join the range on the comma seperator
    displayRange.innerHTML = `${range.reverse().join(', ')}`;

    // If count is greater than 100, set it to 100
    count > 100 ? (count = 100) : (count = count);

    // Get the output div from the table
    const menu = document.getElementById("output-menu");

    // Retrieve the table element from the page
    let table = document.getElementById("output-table");

    // If it exists
    if (table) {
      // Delete the table
      table.remove();
    }

    // Create a new table
    table = document.createElement("table");
    table.id = "output-table";
    table.classList = "table table-dark";

    // Create the table header element
    const thead = document.createElement("thead");

    // Create the table headers

    // Create the control element
    const headers = document.createElement("tr");
    headers.id = "header";
    headers.innerHTML =
      "<th style='width: 10%' scope='col'>Number</th>" +
      "<th style='width: 10%' scope='col'><a class='text-secondary' href='#' onClick='document.report.sort(\"bst\");'>BST</a></th>" +
      "<th style='width: 10%' scope='col'><a class='text-secondary' href='#' onClick='document.report.sort(\"hp\");'>HP</a></th>" +
      "<th style='width: 10%' scope='col'><a class='text-secondary' href='#' onClick='document.report.sort(\"atk\");'>Atk</a></th>" +
      "<th style='width: 10%' scope='col'><a class='text-secondary' href='#' onClick='document.report.sort(\"def\");'>Def</a></th>" +
      "<th style='width: 10%' scope='col'><a class='text-secondary' href='#' onClick='document.report.sort(\"spa\");'>SpA</a></th>" +
      "<th style='width: 10%' scope='col'><a class='text-secondary' href='#' onClick='document.report.sort(\"spd\");'>SpD</a></th>" +
      "<th style='width: 10%' scope='col'><a class='text-secondary' href='#' onClick='document.report.sort(\"spe\");'>Spe</a></th>" +
      "<th style='width: 20%' >Copy</th>";

    thead.appendChild(headers);

    table.appendChild(thead);

    // First entry which will be shown on the page of the table
    let start = count * page;

    // Last entry which will be shown on the page - either up to the end of the array or the end of the page calculated (whichever is closest)
    let end =
      count * page + count < this.content.length
        ? count * page + count
        : this.content.length;

    const tbody = document.createElement("tbody");

    // Iterate over all of the rows in the page
    for (let i = start; i < end; i++) {
      // Dereference the table row
      let spread = this.content[i];

      // Create the row for the element
      const row = document.createElement("tr");

      row.innerHTML = `<td>${getCommaString(i + 1)}</td>
  <td>${spread.bst}</td>
  <td>${spread.evs[0]}<sub>${spread.stats[0]}</sub></td>
  <td>${spread.evs[1]}<sub>${spread.stats[1]}</sub></td>
  <td>${spread.evs[2]}<sub>${spread.stats[2]}</sub></td>
  <td>${spread.evs[3]}<sub>${spread.stats[3]}</sub></td>
  <td>${spread.evs[4]}<sub>${spread.stats[4]}</sub></td>
  <td>${spread.evs[5]}<sub>${spread.stats[5]}</sub></td>
  <td>
    <a class='text-secondary'href='#' onClick='document.report.clipboard(${i})'>Copy to Clipboard</a>
  </td>
`;

      tbody.appendChild(row);
    }

    table.appendChild(tbody);

    menu.appendChild(table);

    // Report is displayed, set as active
    this.active = true;
  }

  sort(row = "bst") {
    // Valid Sort Arguments:
    // BST, HP, Atk, Def, SpA, SpD, Spe

    // Valid Order Arguments:
    // Asc, Dec

    // If the new row is the same as the old row
    if (row == this.row) {
      // flip the sort
      this.asc = !this.asc;
    } // Different row
    else {
      // Return the sort back to default
      this.asc = false;

      // set the last sort to the new one
      this.row = row;
    }

    // Initialise sort function variable
    let sortfunc = null;

    // Ascending or descending order
    let order = this.asc;

    switch (row) {
      case "bst":
        // If we are using ascending order
        if (order) {
          // Use an ascending order sort function for the bst
          sortfunc = function (a, b) {
            return a.bst > b.bst ? 1 : -1;
          };
        } else {
          // Use a descending order sort function for the bst
          sortfunc = function (a, b) {
            return a.bst < b.bst ? 1 : -1;
          };
        }

        break;
      case "hp":
        // If we are using ascending order
        if (order) {
          // Use an ascending order sort function for the bst
          sortfunc = function (a, b) {
            return a.evs[0] > b.evs[0] ? 1 : -1;
          };
        } else {
          // Use a descending order sort function for the bst
          sortfunc = function (a, b) {
            return a.evs[0] < b.evs[0] ? 1 : -1;
          };
        }

        break;
      case "atk":
        // If we are using ascending order
        if (order) {
          // Use an ascending order sort function for the bst
          sortfunc = function (a, b) {
            return a.evs[1] > b.evs[1] ? 1 : -1;
          };
        } else {
          // Use a descending order sort function for the bst
          sortfunc = function (a, b) {
            return a.evs[1] < b.evs[1] ? 1 : -1;
          };
        }

        break;
      case "def":
        // If we are using ascending order
        if (order) {
          // Use an ascending order sort function for the bst
          sortfunc = function (a, b) {
            return a.evs[2] > b.evs[2] ? 1 : -1;
          };
        } else {
          // Use a descending order sort function for the bst
          sortfunc = function (a, b) {
            return a.evs[2] < b.evs[2] ? 1 : -1;
          };
        }

        break;
      case "spa":
        // If we are using ascending order
        if (order) {
          // Use an ascending order sort function for the bst
          sortfunc = function (a, b) {
            return a.evs[3] > b.evs[3] ? 1 : -1;
          };
        } else {
          // Use a descending order sort function for the bst
          sortfunc = function (a, b) {
            return a.evs[3] < b.evs[3] ? 1 : -1;
          };
        }

        break;
      case "spd":
        // If we are using ascending order
        if (order) {
          // Use an ascending order sort function for the bst
          sortfunc = function (a, b) {
            return a.evs[4] > b.evs[4] ? 1 : -1;
          };
        } else {
          // Use a descending order sort function for the bst
          sortfunc = function (a, b) {
            return a.evs[4] < b.evs[4] ? 1 : -1;
          };
        }

        break;
      case "spe":
        // If we are using ascending order
        if (order) {
          // Use an ascending order sort function for the bst
          sortfunc = function (a, b) {
            return a.evs[5] > b.evs[5] ? 1 : -1;
          };
        } else {
          // Use a descending order sort function for the bst
          sortfunc = function (a, b) {
            return a.evs[5] < b.evs[5] ? 1 : -1;
          };
        }

        break;
      default:
        console.log(
          'Default result called because argument "',
          row,
          '"did not match any cases.'
        );

        break;
    }

    // Sort the array using the selected sort function
    this.content.sort(sortfunc);

    // If there is a live table
    if (this.active) {
      // Update the live table
      this.display();
    }
  }

  clipboard(row) {
    // Dereference the row searched for by the command
    let content = this.content[row];

    let str = `${toCapitalCase(this.species)}
Level: ${this.level}
EVs: `;

    // Iterate over all of the evs in the spread
    for (let i = 0; i < content.evs.length; i++) {
      // If the EV string is greater than 0
      if (content.evs[i]) {
        // Append the current EV to the EV string
        str += content.evs[i] + " " + pretty_fields[i];

        // If we are NOT on the last iteration
        if (i < content.evs.length - 1) {
          // Add the '/' character
          str += " / ";
        }
      }
    }

    str = `${str}\n${toCapitalCase(this.nature)} nature`;

    console.log(str);

    // Create Text Area Element
    const el = document.createElement("textarea");

    // Assign the element value to the argument string
    el.value = str;

    // Append text area element to the document body
    document.body.appendChild(el);

    // Select the text area element
    el.select();

    // Perform the content copy command
    document.execCommand("copy");

    // Remove the text area element from the document body
    document.body.removeChild(el);
  }
}
