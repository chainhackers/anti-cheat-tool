import { GetStaticProps, NextPage } from 'next';
import { TeamMember } from 'components';
import styles from 'styles/Team.module.scss';

import team from 'data/team.json';

interface ITeamPageProps {
  team: {
    image: string;
    name: string;
    role: string;
    description: string;
    link: string | null;
    contacts: { type: string; ref: string; image: string }[];
  }[];
}

const Team: NextPage<ITeamPageProps> = ({ team }) => {
  return (
    <div className={styles.container}>
      {team && team.map((teamMember) => <TeamMember {...teamMember} />)}
    </div>
  );
};

export default Team;

export const getStaticProps: GetStaticProps<ITeamPageProps> = () => {
  return {
    props: {
      team: team,
    },
  };
};
