import Head from "next/head";
import "../../../styles/Home.module.css";
import Link from "next/link";
import { Button } from 'react-bootstrap';


const defaultEndpoint = "https://rickandmortyapi.com/api/character/";

export async function getServerSideProps({ query }) {
  const { id } = query;
  const res = await fetch(`${defaultEndpoint}/${id}`);
  const data = await res.json();

  // console.log(data)

  return {
    props: {
      data,
    },
  };
}

export default function Character({ data }) {
  const { name, image, gender, location, origin, species, status } = data;

  return (
    <div>
      <Head>
        <title>{name}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{ margin: "2%" }}>
        <h1>{name}</h1>
        <div className="profile">
          <div className="profile-image">
            <img src={image} alt={name} />
          </div>
          <div className="profile-details">
            <h2>Character Details</h2>
            <ul>
              <li>
                <strong>Name:</strong> {name}
              </li>
              <li>
                <strong>Status:</strong> {status}
              </li>
              <li>
                <strong>Gender:</strong> {gender}
              </li>
              <li>
                <strong>Species:</strong> {species}
              </li>
              <li>
                <strong>Location:</strong> {location?.name}
              </li>
              <li>
                <strong>Originally From:</strong> {origin?.name}
              </li>
            </ul>
          </div>
        </div>
        <center>
          <Button variant="success">
            <Link href="/">
              <a>Back to All Characters</a>
            </Link>
          </Button>
        </center>
      </main>
    </div>
  );
}
