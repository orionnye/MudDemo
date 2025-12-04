import { useUser } from './UserProvider';

const HealthBanner = () => {
  const { user, incrementHealth } = useUser();

  return (
    <div className="health-banner">
      <span className="health-label">Health:</span>
      <span className="health-value">{user.health}</span>
      <button className="health-button" onClick={incrementHealth}>
        +1 Health
      </button>
    </div>
  );
};

export default HealthBanner;

