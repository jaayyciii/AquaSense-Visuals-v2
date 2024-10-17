import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { ref, onValue, get } from "firebase/database";
import { db } from "../FirebaseConfig";
import { useAuth } from "../AuthContext";
import Notifications from "../notification/Notifications";
import Notify from "../notification/Notify";
import NavPanel from "./NavPanel";
import Header from "./Header";

// typescript data types
export type ConfigurePortType = {
  value: boolean;
  index: number;
};

export type NotificationsType = {
  key: string;
  port: number;
  text: string;
  timestamp: Date;
  viewed: boolean;
};

export type PortListType = {
  name: string;
  active: boolean;
  display: boolean;
};

export type ContextType = {
  portListLoading: boolean;
  portList: PortListType[];
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  admin: boolean;
};

export default function HomeLayout() {
  // holds user credentials obtained from Auth Context
  const { currentUser } = useAuth();
  //  role-based access control
  const [admin, setAdmin] = useState<boolean>(false);
  // list of ports with its active and display details
  const [portList, setPortList] = useState<PortListType[]>([
    { name: "Channel 0", active: false, display: false },
    { name: "Channel 1", active: false, display: false },
    { name: "Channel 2", active: false, display: false },
    { name: "Channel 3", active: false, display: false },
    { name: "Channel 4", active: false, display: false },
    { name: "Channel 5", active: false, display: false },
    { name: "Channel 6", active: false, display: false },
    { name: "Channel 7", active: false, display: false },
  ]);
  // port list loading state
  const [portListLoading, isPortListLoading] = useState<boolean>(true);
  // list of notifications
  const [notifications, setNotifications] = useState<NotificationsType[]>([]);
  // counts the number of unviewed/ unhandled notifications for UX
  const [nView, setNView] = useState<number>(0);
  // sets the instantaneous prompt/ notification for UX
  const [prompt, setPrompt] = useState<string>("");

  // renders the actual message based on the type of notification
  function getMessage(type: number, portIndex: number) {
    const portName = portList[portIndex].name;

    switch (type) {
      case 1:
        return `${portName} has been activated by the local server. Would you like to configure it now?`;
      case 2:
        return `${portName} has been inactive during display. Please check for connection issues.`;
      case 3:
        return `${portName}'s current reading has exceeded the upper threshold. Automated actuation has been triggered.`;
      case 4:
        return `${portName}'s current reading has exceeded the lower threshold. Automated actuation has been triggered.`;
      case 5:
        return `The predicted value of ${portName} in the next 30 minutes is expected to exceed the threshold. Would you like to initiate actuation now?`;
      default:
        return "Error: Unrecognized notification. Please ignore this message.";
    }
  }

  // gets the active value per port from the firebase and stores at portlist
  useEffect(() => {
    isPortListLoading(true);
    const unsubscribe = onValue(
      ref(db, "ConfigurationFiles/Active"),
      (snapshot) => {
        if (snapshot.exists()) {
          const firebaseSnapshot = snapshot.val();
          setPortList((prevPortList) => {
            return prevPortList.map((port, index) => ({
              ...port,
              active: firebaseSnapshot[index] === "T",
            }));
          });
          isPortListLoading(false);
        }
      },
      () => {
        setPrompt(
          `Oops! Something went wrong while loading port list status. Please try again or check your connection`
        );
      }
    );

    return () => {
      unsubscribe();
    };
  }, [db]);

  // gets the display value per port from the firebase and stores at portlist
  useEffect(() => {
    isPortListLoading(true);
    const unsubscribe = onValue(
      ref(db, "ConfigurationFiles/Display"),
      (snapshot) => {
        if (snapshot.exists()) {
          const firebaseSnapshot = snapshot.val();
          setPortList((prevPortList) => {
            return prevPortList.map((port, index) => ({
              ...port,
              display: firebaseSnapshot[index] === "T",
            }));
          });
          isPortListLoading(false);
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [db]);

  // gets the list of notifications from the firebase and sets accordingly
  useEffect(() => {
    const unsubscribe = onValue(ref(db, "Notifications/"), (snapshot) => {
      if (snapshot.exists()) {
        const notifs = Object.values(snapshot.val());
        const keys = Object.keys(snapshot.val());
        setNView(notifs.filter((n: any) => n.viewed === "F").length);
        setNotifications(
          notifs.map((n: any, index) => {
            return {
              key: keys[index],
              port: n.port,
              text: getMessage(n.type, n.port),
              timestamp: new Date(n.timestamp),
              viewed: n.viewed === "T",
            };
          })
        );
      }
    });

    return () => unsubscribe();
  }, []);

  // get user's role status for access control
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const snapshot = await get(ref(db, `Users/${currentUser?.uid}`));
        if (snapshot.exists()) {
          const firebaseSnapshot = snapshot.val();
          setAdmin(firebaseSnapshot === "A");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchRole();
  }, [currentUser]);

  return (
    <>
      {/* Notifications */}
      <Notify
        notifications={notifications}
        setPrompt={setPrompt}
        prompt={prompt}
      />
      <Notifications notifications={notifications} admin={admin} />

      {/* Home Layout */}
      <NavPanel nView={nView} setPrompt={setPrompt} />
      <Header setPrompt={setPrompt} admin={admin} />
      {/* React Router Outlet */}
      <div
        className="d-flex flex-column bg-body-primary"
        style={{ minHeight: "100vh", height: "100%", width: "100%" }}
      >
        <div style={{ minHeight: "55px" }} />
        <div className="d-flex flex-row flex-grow-1">
          <div className="d-none d-md-flex" style={{ minWidth: "260px" }} />
          <Outlet context={{ portListLoading, portList, setPrompt, admin }} />
        </div>
        <div className="d-block d-md-none" style={{ minHeight: "55px" }} />
      </div>
    </>
  );
}
