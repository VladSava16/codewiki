import React from 'react'
import '../index.css'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageDivider from '../components/PageDivider'
import Rating from '../components/Rating'
import ProblemSetTable from '../components/ProblemSetTable'
import ResourcesTable from '../components/ResourcesTable'

function Post() {
  const Headings = ({ headings, activeId }) => (
    <ul className='text-gray-600 font-quicksand font-semibold list-disc'>
      {headings.map((heading) => (
        <li id='headingLI' key={heading.id} className={heading.id === activeId ? "active" : ""}>
          <a
            href={`#${heading.id}`}
            onClick={(e) => {
              e.preventDefault();
              document.querySelector(`#${heading.id}`).scrollIntoView({
                behavior: "smooth"
              });
            }}
          >
            {heading.title}
          </a>
          {heading.items.length > 0 && (
            <ul>
              {heading.items.map((child) => (
                <li
                  id='headingLI'
                  key={child.id}
                  className={child.id === activeId ? "active" : ""}
                >
                  <a
                    href={`#${child.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.querySelector(`#${child.id}`).scrollIntoView({
                        behavior: "smooth"
                      });
                    }}
                  >
                    {child.title}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );

  /**
   * Dynamically generates the table of contents list, using any H2s and H3s it can find in the main text
   */
  const useHeadingsData = () => {
    const [nestedHeadings, setNestedHeadings] = React.useState([]);

    React.useEffect(() => {
      const headingElements = Array.from(
        document.querySelectorAll("main h2, main h3")
      );

      // Created a list of headings, with H3s nested
      const newNestedHeadings = getNestedHeadings(headingElements);
      setNestedHeadings(newNestedHeadings);
    }, []);

    return { nestedHeadings };
  };

  const getNestedHeadings = (headingElements) => {
    const nestedHeadings = [];

    headingElements.forEach((heading, index) => {
      const { innerText: title, id } = heading;

      if (heading.nodeName === "H2") {
        nestedHeadings.push({ id, title, items: [] });
      } else if (heading.nodeName === "H3" && nestedHeadings.length > 0) {
        nestedHeadings[nestedHeadings.length - 1].items.push({
          id,
          title
        });
      }
    });

    return nestedHeadings;
  };

  const useIntersectionObserver = (setActiveId) => {
    const headingElementsRef = React.useRef({});
    React.useEffect(() => {
      const callback = (headings) => {
        headingElementsRef.current = headings.reduce((map, headingElement) => {
          map[headingElement.target.id] = headingElement;
          return map;
        }, headingElementsRef.current);

        // Get all headings that are currently visible on the page
        const visibleHeadings = [];
        Object.keys(headingElementsRef.current).forEach((key) => {
          const headingElement = headingElementsRef.current[key];
          if (headingElement.isIntersecting) visibleHeadings.push(headingElement);
        });

        const getIndexFromId = (id) =>
          headingElements.findIndex((heading) => heading.id === id);

        // If there is only one visible heading, this is our "active" heading
        if (visibleHeadings.length === 1) {
          setActiveId(visibleHeadings[0].target.id);
          // If there is more than one visible heading,
          // choose the one that is closest to the top of the page
        } else if (visibleHeadings.length > 1) {
          const sortedVisibleHeadings = visibleHeadings.sort(
            (a, b) => getIndexFromId(a.target.id) > getIndexFromId(b.target.id)
          );

          setActiveId(sortedVisibleHeadings[0].target.id);
        }
      };

      const observer = new IntersectionObserver(callback, { root: document.querySelector("iframe"), rootMargin: "500px" });

      const headingElements = Array.from(document.querySelectorAll("h2, h3"));

      headingElements.forEach((element) => observer.observe(element));

      return () => observer.disconnect();
    }, [setActiveId]);
  };

  /**
   * Renders the table of contents.
   */
  const TableOfContents = () => {
    const [activeId, setActiveId] = React.useState();
    const { nestedHeadings } = useHeadingsData();
    useIntersectionObserver(setActiveId);

    return (
      <nav className='flex flex-col gap-3 w-[220px] min-w-[220px] pl-2 font-medium self-start sticky top-[64px] md:top-[64px] max-h-[800px] overflow-auto' aria-label="Table of contents">
        <span className='font-bold text-orange-500'> TABLE OF CONTENTS </span>
        <Headings headings={nestedHeadings} activeId={activeId} />
      </nav>
    );
  };

  const DummyText =
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type spe`ci`men book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

  return (
    <div className='bg-white font-poppins'>
      <div className='bg-gradient-to-br from-[#102a4a] to-[#342a84] mb-16'>
        <Navbar />
        <PageDivider />
      </div>

      <div className='md:flex pb-16 md:pb-0 gap-10 justify-center'>
        <div className="max-w-full md:max-w-[1024px] px-6 md:py-16 space-y-12 text-gray-800">
          <Rating stars={4} onBlogPost={true} />

          <div>
            {/* Title */}
            <h1 className='text-gray-800 font-bold text-4xl w-full -mt-5 -mb-3'>
              Additional DP Optimizations and Techniques
            </h1>

            {/* Authors */}
            <h2 className='text-gray-600 font-medium text-lg mt-5 -mb-3'>
              Authors: Alexandru Toma
            </h2>
          </div>

          <div className="divider w-[95%]"></div>

          <div className='flex flex-col gap-5 md:hidden'>
            {/* <div>
              <a href="#" class="bg-purple-500 ml-2 hover:bg-purple-600 hover:shadow-md text-gray-100 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 dark:hover:bg-blue-300">Olimpiada</a>
              <a href="#" class="bg-purple-500 hover:bg-purple-600 hover:shadow-md text-gray-100 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 dark:hover:bg-blue-300">Clasa XI</a>
            </div> */}
            <TableOfContents />
          </div>

          <div className='max-w-[900px]'>
            {/* Content */}
            <main className=''>
              <h2 className='text-orange-500 mb-3 pt-[16px] mt-[-16px] text-3xl font-montserrat font-medium' id="motivation-header">Motivation</h2>
              <p className='mb-10'>{DummyText}</p>

              <h1 className='font-bold text-3xl mb-5'> Minimum Spanning Trees </h1>


              <div className='mt-5'>
                <span className='font-bold'> Kruskal's Algorithm </span>
                finds the MST by greedily adding edges. For all edges
                not yet in the MST, we can repeatedly add the edge of minimum weight to the MST
                except when adding edges that would forms a cycle. This can be done by sorting
                the edges in order of non-decreasing weight. Furthermore, we can easily
                determine whether adding an edge will create a cycle in constant time using

                <span className='text-[#2563eb] font-medium'> Union Find </span>
                . Note that since the most expensive operation is sorting
                the edges, the computational complexity of Kruskal's Algorithm is
              </div>

              <h2 className='text-orange-500 mb-3 pt-[16px] mt-10 text-3xl' id="prerequisites-header">Prerequisites</h2>
              <p className='mb-10'>{DummyText}</p>

              <h2 className='text-orange-500 mb-3 pt-[16px] mt-[-16px] text-3xl' id="tutorial-header">Tutorial</h2>
              <p className='mb-10'>{DummyText}</p>

              <h2 className='text-orange-500 mb-3 pt-[16px] mt-[-16px] text-3xl' id="solved-problems-header">Solved Problems</h2>
              <p>{DummyText}</p>
              <p className='mb-10'>{DummyText}</p>

              <div className='mt-10 mb-10'>
                <ResourcesTable />
              </div>

              <h2 className='text-orange-500 mb-3 pt-[16px] mt-[-16px] text-3xl' id="fourth-header">Practice Problems</h2>
              <p>{DummyText}</p>
              <p>{DummyText}</p>
              <p>{DummyText}</p>
              <p className='mb-10'>{DummyText}</p>

              <div className='mt-10'>
                <ProblemSetTable />
              </div>

            </main>
          </div>
        </div>
        <div className='hidden md:flex md:flex-col gap-5 md:mt-20'>
          {/* <div>
            <a href="#" class="bg-purple-500 ml-2 hover:bg-purple-600 hover:shadow-md text-gray-100 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 dark:hover:bg-blue-300">Olimpiada</a>
            <a href="#" class="bg-purple-500 hover:bg-purple-600 hover:shadow-md text-gray-100 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 dark:hover:bg-blue-300">Clasa XI</a>
          </div> */}
          <TableOfContents />


        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Post