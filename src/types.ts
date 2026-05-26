export type Role = { id: string; name: string };

export type Service = {
  id: string;
  name: string;
  datetime: string;
  active: boolean;
  roles: { role: Role }[];
};

export type Member = {
  id: string;
  name: string;
  active: boolean;
  roles: { role: Role }[];
};

export type Instance = {
  id: string;
  date: string;
  published: boolean;
  service: {
    name: string;
    time: string;
  };
  assignments: {
    id: string;
    role: { name: string };
    member: Member | null;
  }[];
};

export type RosterInstance = {
  date: Date;
  service: { name: string };
  assignments: { role: { name: string }; member: { name: string } | null }[];
};
