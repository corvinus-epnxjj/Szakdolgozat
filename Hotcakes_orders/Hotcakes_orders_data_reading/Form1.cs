using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using Hotcakes.CommerceDTO.v1;
using Hotcakes.CommerceDTO.v1.Client;
using Hotcakes.CommerceDTO.v1.Contacts;
using Hotcakes.CommerceDTO.v1.Orders;
using Newtonsoft.Json;

namespace Hotcakes_orders_data_reading
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
            GetOrders();
            ordersDataGridView.Enabled = false;
        }

        public async void ReadData()
        {
            string url = "http://www.dnndev.me";
            string key = "1-89fe088e-4b8f-4762-8012-09251c42276c";

            Api proxy = new Api(url, key);

            Random rnd = new Random();
         
            using (StreamReader sr = new StreamReader("orders/orders.csv", Encoding.UTF8))
            {
                var firstLine = sr.ReadLine();

                while (!sr.EndOfStream) {
                    
                    var line = sr.ReadLine();
                    var item = line.Split(';');

                    var order = new OrderDTO();

                    order.Items = new List<LineItemDTO>();
                    order.Items.Add(new LineItemDTO
                    {
                        Quantity = int.Parse(item[0]),
                        ProductName = item[1]
                    });

                    ApiResponse<OrderDTO> response = proxy.OrdersCreate(order);

                    await Task.Delay(rnd.Next(4000, 10000));
                    GetOrders();
                }
                
                sr.Close();         
            }       
        }

        public void GetOrders()
        {
            string url = "http://www.dnndev.me";
            string key = "1-89fe088e-4b8f-4762-8012-09251c42276c";

            Api proxy = new Api(url, key);

            ApiResponse<List<OrderSnapshotDTO>> response = proxy.OrdersFindAll();
            string json = JsonConvert.SerializeObject(response);

            ApiResponse<List<OrderSnapshotDTO>> deserializedResponse = JsonConvert.DeserializeObject<ApiResponse<List<OrderSnapshotDTO>>>(json);

            DataTable dt = new DataTable();
            dt.Columns.Add("Id", typeof(int));
            dt.Columns.Add("bvin", typeof(string));
            dt.Columns.Add("ProductName", typeof(string));
            dt.Columns.Add("Quantity", typeof(int));

            foreach (OrderSnapshotDTO item in deserializedResponse.Content)
            {
                ApiResponse<OrderDTO> res = proxy.OrdersFind(item.bvin.ToString());             
                dt.Rows.Add(item.Id, item.bvin, res.Content.Items[0].ProductName, res.Content.Items[0].Quantity);
            }

            ordersDataGridView.DataSource = dt;
        }

        private void startButton_Click(object sender, EventArgs e)
        {
            ReadData();
            startButton.Enabled = false;
        }
    }
}
