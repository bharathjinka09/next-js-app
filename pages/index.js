import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";

import { Button } from "react-bootstrap";

const defaultEndpoint = "https://rickandmortyapi.com/api/character/";

export async function getServerSideProps() {
  const res = await fetch(defaultEndpoint);
  const data = await res.json();

  // console.log(data)

  return {
    props: {
      data,
    },
  };
}

export default function Home({ data }) {
  // renaming the results to defaultResults
  const { info, results: defaultResults = [] } = data;

  const [results, setResults] = useState(defaultResults);

  const [page, setPage] = useState({
    ...info,
    currentPage: defaultEndpoint,
  });

  const { currentPage } = page;

  useEffect(() => {
    if (currentPage === defaultEndpoint) return;

    async function request() {
      const res = await fetch(currentPage);
      const nextData = await res.json();

      setPage({
        currentPage,
        ...nextData.info,
      });

      if (!nextData.info?.prev) {
        setResults(nextData.results);
        return;
      }

      setResults((prev) => {
        return [...prev, ...nextData.results];
      });
    }

    request();
  }, [currentPage]);

  function handleLoadMore() {
    setPage((prev) => {
      return {
        ...prev,
        currentPage: page?.next,
      };
    });
  }

  function handleOnSubmitSearch(e) {
    e.preventDefault();

    const { currentTarget = {} } = e;
    const fields = Array.from(currentTarget?.elements);
    const fieldQuery = fields.find((field) => field.name === "query");

    const value = fieldQuery.value || "";
    const endpoint = `https://rickandmortyapi.com/api/character/?name=${value}`;

    setPage({
      currentPage: endpoint,
    });
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Wubba Lubba Dub dub!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Wubba Lubba Dub dub!</h1>

        <p className={styles.description}>Rick and Morty Wiki</p>

        <form className="search" onSubmit={handleOnSubmitSearch}>
          <input className='form-control mb-2' name="query" type="search" />

          <button className='btn btn-primary' type='submit' variant="primary" style={{ cursor: "pointer" }}>
            Search
          </button>
        </form>

        <ul className={styles.grid}>
          {results.map((result) => {
            const { id, name, image } = result;

            return (
              <li key={id} className={styles.card}>
                <Link href="/character/[id]" as={`/character/${id}`}>
                  <a>
                    <img src={image} alt={`${name} thumb`} />
                    <h3>{name}</h3>
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
        <p>
          <Button
            variant="info"
            style={{ cursor: "pointer" }}
            onClick={handleLoadMore}
          >
            Load More
          </Button>
        </p>
      </main>

      <footer className={styles.footer}>Developed by Bharath</footer>
    </div>
  );
}
