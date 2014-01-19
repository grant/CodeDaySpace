using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GameServer
{
    static class Helpers
	{
		public static short ReadShort(byte[] data, ref int ptr)
		{
			return (short)(data[ptr++] * 256 + data[ptr++]);
		}
	}

    struct Actor
    {
        public short ActorID, UserID;
        public byte[] Data;
    }

    class Game
    {
        Dictionary<string, int> users;
        Dictionary<int, byte[]> actors;

        public Game()
        {
            users = new Dictionary<string, int>();
			actors = new Dictionary<int, byte[]>();
        }

        public int GetUserId(string user)
        {
            if (users.ContainsKey(user))
                return users[user];
            int id = users.Count;
            users.Add(user, id);
            return id;
        }

        public void Update(int user, byte[] data)
        {
			lock (actors)
			{
				actors[user] = data;
			}
			//int ptr = 0;
			//while (ptr < data.Length)
			//{
			//	short userID = Helpers.ReadShort(data, ref ptr);
			//	short actorID = Helpers.ReadShort(data, ref ptr);
			//	byte action = data[ptr++];
				
			//	short len = Helpers.ReadShort(data, ref ptr);
			//	byte[] actData = data.Skip(ptr).Take(len).ToArray();
			//}
        }

		public string GetPlayersString()
		{
			return users.Aggregate("", (lst, usr) =>
				lst + (char)usr.Value + (char)(usr.Key.Length) + usr.Key);
		}

        public byte[] GetDatas(int user)
        {
			lock (actors)
			{
				return actors.Where(id_data => id_data.Key != user).Aggregate(new List<byte>(),
						(cur, next) => { cur.AddRange(next.Value); return cur; }).ToArray();
			}
        }

		public byte[] GetDatas()
		{
			lock (actors)
			{
				return actors.Aggregate(new List<byte>(),
					(cur, next) => { cur.AddRange(next.Value); return cur; }).ToArray();
			}
		}
    }
}
