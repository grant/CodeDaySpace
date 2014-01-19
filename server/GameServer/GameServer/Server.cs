using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Alchemy;
using Alchemy.Classes;

namespace GameServer
{
    class Server
    {
		Game game;

        public Server()
		{
			WebSocketServer srv = new WebSocketServer(999);
			srv.OnConnect = onConnect;
			srv.Start();

			game = new Game();
		}

		//add new user to 
		void onConnect(UserContext cont)
		{
			cont.SetOnReceive(userMessage);
		}

		void userMessage(UserContext cont)
		{
			List<byte> data = cont.DataFrame.AsRaw().Aggregate(new List<byte>(), (cur, frag) => {
				cur.AddRange(frag); return cur;
			});
			switch (data[0])
			{
				case 0://ID request
					string name = System.Text.ASCIIEncoding.UTF8.GetString(data.Skip(1).ToArray());
					int id = game.GetUserId(name);
					cont.Send(System.Text.ASCIIEncoding.UTF8.GetString(new byte[] { (byte)(id / 256), (byte)(id % 256) }));
					break;
				case 1://Opponent name request
					cont.Send(game.GetPlayersString());
					break;
				case 2://New data push
					game.Update(data[1] * 256 + data[2], data.Skip(3).ToArray());
					break;
				case 3://Request all data
					cont.Send(System.Text.ASCIIEncoding.UTF8.GetString(game.GetDatas()));
					break;
				case 4://New data push + get others' data
					int plId = data[1] * 256 + data[2];
					game.Update(plId, data.Skip(3).ToArray());
					cont.Send(System.Text.ASCIIEncoding.UTF8.GetString(game.GetDatas(plId)));
					break;
			}
		}
    }
}
