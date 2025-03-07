/**
 * @file projects.js
 * @description This file contains JavaScript code specific to the projects page.
 * It primarily manages the projects page's overview, project listings pages'
 * animations and the Isotope layout.
 */

document.addEventListener("DOMContentLoaded", function () {
  // ----- Initialize Isotope -----
  const isotopeContainer = document.getElementById("isotope-container");

  let isotope;

  if (isotopeContainer) {
    isotope = new Isotope(isotopeContainer, {
      itemSelector: ".isotope-item",
      layoutMode: "masonry",
      percentPosition: true, // responsive cards
      masonry: {
        columnWidth: ".isotope-item", // or a fixed width: 300
        gutter: 20, // Space
      },
      transitionDuration: "0.4s", // Adjust animation speed
      stagger: 30, // stagger the elements
    });

    // Trigger layout after each image loads inside isotope items
    const placeHolderImages =
      isotopeContainer.querySelectorAll(".isotope-item img"); //Select every img
    placeHolderImages.forEach((placeHolderImage) => {
      placeHolderImage.addEventListener("load", () => {
        isotope.layout(); // Recalculate layout dynamically
      });
    });

    // **Force Isotope layout on window resize**
    window.addEventListener("resize", function () {
      isotope.layout(); // Recalculate layout dynamically
    });

    // Debounce Resize Logic:
    // let resizeTimeout;

    // window.addEventListener("resize", function () {
    //   clearTimeout(resizeTimeout); // Clear previous timeout

    //   isotope.layout(); // Force immediate layout update

    //   // Add a small delay to re-check the layout after resizing stops
    //   resizeTimeout = setTimeout(() => {
    //     isotope.layout();
    //   }, 100); // Adjust this delay if needed
    // });
  }
  // ------------------------------
  const overviewButton = document.getElementById("overviewButton");
  const truncatedOverviewContent = document.getElementById(
    "truncatedOverviewContent"
  );
  const overviewContent = document.getElementById("overviewContent");
  const projectListingsHeader = document.querySelector("h2.hidden_slide_in");
  const placeholderItems = document.querySelectorAll(".project-placeholder");
  const projectListings = document.querySelectorAll("div.fade_in");
  const paginationContainer = document.querySelector(
    "div.pagination-container"
  );
  const footerSection = document.querySelector(".footer");

  setTimeout(() => {
    overviewButton.classList.add("visible");

    overviewButton.addEventListener("click", function (event) {
      overviewButton.disabled = true;

      event.stopPropagation();

      if (overviewContent.classList.contains("fade_out")) {
        if (truncatedOverviewContent.classList.contains("fade-in")) {
          truncatedOverviewContent.classList.remove("fade-in");
          truncatedOverviewContent.classList.add("fade_out");
          // truncatedOverviewContent.addEventListener(
          // "animationend",
          // () => {
          // setTimeout(() => {
          truncatedOverviewContent.classList.add("hidden");
          // }, 500);
          // },
          // { once: true }
          // );
        }
        overviewButton.style.marginBottom = "48px";
        overviewContent.classList.remove("fade_out", "hidden");
        overviewContent.classList.add("fade-in");
        overviewButton.disabled = false;
      } else {
        overviewContent.classList.remove("fade-in");
        overviewContent.classList.add("fade_out");
        // overviewContent.addEventListener(
        // "animationend",
        // () => {
        setTimeout(() => {
          overviewContent.classList.add("hidden");
          overviewButton.disabled = false;
        }, 450);
        // overviewButton.style.marginBottom = "0";
        // },
        // { once: true }
        // );
        // setTimeout(() => {
        overviewButton.style.marginBottom = "0";
        // }, 1000);
      }
    });

    overviewButton.addEventListener("mouseenter", function (event) {
      if (
        truncatedOverviewContent.classList.contains("fade_out") &&
        overviewContent.classList.contains("fade_out")
      ) {
        overviewButton.style.marginBottom = "48px";
        truncatedOverviewContent.classList.remove("fade_out", "hidden");
        truncatedOverviewContent.classList.add("fade-in");
        overviewButton.disabled = false;
      }
    });

    overviewButton.addEventListener("mouseleave", function (event) {
      if (
        truncatedOverviewContent.classList.contains("fade-in") ||
        overviewContent.classList.contains("fade-in")
      ) {
        truncatedOverviewContent.classList.remove("fade-in");
        truncatedOverviewContent.classList.add("fade_out");
        // truncatedOverviewContent.addEventListener(
        // "animationend",
        // () => {
        setTimeout(() => {
          truncatedOverviewContent.classList.add("hidden");
          overviewButton.disabled = false;
        }, 100);
        // },
        // { once: true }
        // );
        // if (overviewContent.classList.contains("fade_out")) {
        // setTimeout(() => {
        if (overviewContent.classList.contains("fade_out")) {
          overviewButton.style.marginBottom = "0";
        }
        // }, 1000);
        // }
      }
    });

    document.addEventListener("click", function (event) {
      if (
        !overviewButton.contains(event.target) &&
        !overviewContent.contains(event.target) &&
        overviewContent.classList.contains("fade-in")
      ) {
        overviewContent.classList.remove("fade-in");
        overviewContent.classList.add("fade_out");
        // overviewContent.addEventListener(
        // "animationend",
        // () => {
        setTimeout(() => {
          overviewContent.classList.add("hidden");
          overviewButton.disabled = false;
        }, 450);
        // },
        // { once: true }
        // );
        //   setTimeout(() => {
        overviewButton.style.marginBottom = "0";
        //   }, 1000);
      }
    });
  }, 8750);

  setTimeout(() => {
    projectListingsHeader.classList.add("visible");
  }, 5500);

  setTimeout(() => {
    placeholderItems.forEach((placeholder) => {
      placeholder.classList.add("visible");
    });
  }, 8250);

  setTimeout(() => {
    // 1. Hide Placeholders
    placeholderItems.forEach((placeholder) => {
      placeholder.style.display = "none";
      placeholder.remove(); // Remove from DOM
    });

    // 2. Show Project Content
    projectListings.forEach((projectListing) => {
      projectListing.style.display = "block";
      projectListing.classList.add("visible");
    });

    // 3. RELAYOUT ISOTOPE
    if (isotope) {
      isotope.reloadItems(); // This tells Isotope that the items have changed
      isotope.arrange();

      // Trigger layout after each image loads inside isotope items
      const projectMedia =
        isotopeContainer.querySelectorAll(".isotope-item img");
      projectMedia.forEach((media) => {
        media.addEventListener("load", () => {
          isotope.layout();
        });
      });
    }

    // 4. Debounce/Throttle Playback
    // Example: Pause GIFs when scrolled out of view (using Intersection Observer)
    const gifs = document.querySelectorAll('img[src$=".gif"]'); // Select all GIFs

    const config = {
      rootMargin: "50px 0px",
      // rootMargin: "25px 0px",
      threshold: 0.01,
    };

    let observer = new IntersectionObserver(function (entries, self) {
      entries.forEach((entry) => {
        const gif = entry.target;
        if (entry.isIntersecting) {
          // Play GIF (restart if needed)
          if (gif.dataset.paused) {
            gif.src = gif.dataset.originalSrc; // Restore original src
            gif.removeAttribute("data-paused");
          }
        } else {
          // Pause GIF
          gif.dataset.originalSrc = gif.src; // Store the original src
          gif.src = ""; // Setting src to empty pauses the GIF
          gif.dataset.paused = "true";
        }
      });
    }, config);

    gifs.forEach((gif) => {
      observer.observe(gif);
    });
  }, 11250);

  setTimeout(() => {
    paginationContainer.classList.add("visible");
  }, 8500);

  setTimeout(() => {
    footerSection.classList.add("visible");
  }, 11000);
});
